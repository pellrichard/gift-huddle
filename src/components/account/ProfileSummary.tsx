import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("", ""); // placeholder

export default function ProfileSummary() {
  useEffect(() => {
    // load profile extras...
  }, [supabase]);

  return <div>Profile Summary</div>;
}
