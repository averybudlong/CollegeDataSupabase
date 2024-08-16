import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const supabase = createClient();
  const { data: college } = await supabase.from("college").select("*");

  return <pre>{JSON.stringify(college, null, 2)}</pre>;
}
