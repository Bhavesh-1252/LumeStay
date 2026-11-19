4 Layers Architecture

UI - Things to show the user
=> Components 
=> Pages

Hook - for managing states and api layer
=> hooks

State - data store
=> auth.context.jsx
=> other context.jsx (files)

Api - for communication with backend server
=> services
    => auth.api.js
    


How to structure it

Split it into a form component and two thin pages:

ListingForm is the shared component. It renders the fields and handles the form state.
CreateListing is a page that renders ListingForm with empty values. On submit it calls the create API.
EditListing is a page that fetches the listing by id and renders ListingForm with that data filled in. On submit it calls the update API.

The form shouldn’t know whether it’s creating or editing. It only knows about its inputs:

initialValues: the starting data. It’s empty for create and the fetched listing for edit.
onSubmit: a function the page passes in. Each page decides what to call and where to redirect afterwards.
submitLabel (optional): “Create listing” or “Save changes”.
Loading and error flags: the page’s request status, so the form can disable the button and show the red error box.

Things to watch for in edit mode

Fetch before the form mounts. If the form’s state is initialized from initialValues and the listing hasn’t loaded yet, the fields start empty and stay empty. Show your spinner while loading, and render the form only once the data exists. The alternative is a key={listing._id} on the form so it remounts when the data arrives.
The image is optional on edit. The user may not want to replace it. Show the current image as the preview, and send a new file only if they pick one. On the backend, keep the old image when none is uploaded.
Delete the old image when replaced. If you store images on Cloudinary or disk, remove the old file when a new one is uploaded, or you’ll accumulate orphans.
Ownership check. The server must verify that the logged-in user owns the listing before updating, even if the Edit button is hidden for others.
Geometry on update. If location or country changes, re-run the geocoding. If they didn’t change, skip it to save a request.
Method choice. PUT or PATCH both work. PATCH fits when you only send changed fields.