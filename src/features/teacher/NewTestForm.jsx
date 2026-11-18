import { sb } from "@/lib/supabase";
import TestForm from "./TestForm";

export default function NewTestForm({ done }) {
  return (
    <TestForm
      submitLabel="සාදන්න (ඊළඟට ප්‍රශ්න එකතු කරන්න)"
      onSubmit={async (row) => {
        const { data, error } = await sb.from("tests").insert(row).select().single();
        if (error) return error.message;
        done(data);
      }}
    />
  );
}
