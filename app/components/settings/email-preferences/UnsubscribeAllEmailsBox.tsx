import Warning from "../../ui/icons/Warning";

export default function UnsubscribeAllEmailsBox() {
  return (
    <div className="mt-6 w-full bg-[#fdb624] p-4 flex gap-x-4 rounded-[6px] text-black-2">
      {/** Warning icon */}
      <span>
        <Warning size="20" />
      </span>

      {/** Text */}
      <span className="text-[15px] font-medium -mt-0.5">
        Unsubscribing from all emails means you will no longer receive any
        emails including important notices like ticket confirmations and
        password reset emails.
      </span>
    </div>
  );
}
