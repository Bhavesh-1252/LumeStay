

const NewPasswordForm = () => {
  return (
    <form  className="space-y-4">
      <h1 className="text-xl font-semibold">Set a new password</h1>
      <input
        type="password"
        // value={password}
        // onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-full rounded border p-2"
        required
      />
      <input
        type="password"
        value={confirm}
        // onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm password"
        className="w-full rounded border p-2"
        required
      />
      {/* {error && <p className="text-sm text-red-600">{error}</p>} */}
      <button
        // disabled={loading}
        className="w-full rounded bg-black p-2 text-white disabled:opacity-50"
      >
        {/* {loading ? "Resetting..." : "Reset password"} */}
      </button>
    </form>
  );
};

export default NewPasswordForm;
