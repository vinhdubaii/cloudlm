/**
 * CloudLM — auth.js
 * Dung chung cho index.html, discover.html, admin.html.
 * Phai load supabase-js truoc file nay:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script type="module" src="/auth.js"></script>
 */

const SUPABASE_URL = "https://pxpijosyqijtsvfvrnbx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i1prms5Yn6XQy2cwYI9P4Q_H-xhK_dt";

export const LOGIN_PATH = "/";
export const DISCOVER_PATH = "/discover";

export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Tra ve session neu da dang nhap, ngoai ra redirect ve LOGIN_PATH va
 * tra ve null. Goi o dau moi trang can dang nhap (discover.html, admin.html)
 * TRUOC KHI load/hien thi bat ky data nao.
 */
export async function requireSession(redirectPath = LOGIN_PATH) {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) {
    window.location.replace(redirectPath);
    return null;
  }
  return data.session;
}

/**
 * Nhu requireSession, nhung con check email co trong bang `admins` khong.
 * Dung o dau admin.html. Neu khong phai admin thi redirect ve DISCOVER_PATH.
 */
export async function requireAdmin(redirectPath = DISCOVER_PATH) {
  const session = await requireSession(LOGIN_PATH);
  if (!session) return null;

  const { data: isAdmin, error } = await supabaseClient.rpc("is_admin");

  if (error || !isAdmin) {
    window.location.replace(redirectPath);
    return null;
  }
  return session;
}

export async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.replace(LOGIN_PATH);
}

/**
 * Dang nhap Google, dung o index.html.
 */
export async function signInWithGoogle(redirectTo = window.location.origin + DISCOVER_PATH) {
  return supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });
}
