import { supabase } from "./supabase";

const rolePermissions = {
  admin: {
    label: "Administrator",
    can_upload: true,
    can_branding: true,
    can_manage_users: true,
    can_manage_roles: true,
    can_view_all_data: true,
  },
  petugas: {
    label: "Petugas",
    can_upload: false,
    can_branding: false,
    can_manage_users: false,
    can_manage_roles: false,
    can_view_all_data: true,
  },
  kades: {
    label: "Kades",
    can_upload: false,
    can_branding: false,
    can_manage_users: false,
    can_manage_roles: false,
    can_view_all_data: true,
  },
  wajibpajak: {
    label: "Wajib Pajak",
    can_upload: false,
    can_branding: false,
    can_manage_users: false,
    can_manage_roles: false,
    can_view_all_data: false,
  },
};

export async function loginUser(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  const currentUser = await getCurrentUser();

  return {
    success: true,
    user: currentUser,
  };
}

export async function logoutUser() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) return null;

  const authUser = session.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  const roleKey = profile?.role || "petugas";
  const permissions = rolePermissions[roleKey] || rolePermissions.petugas;

  return {
    id: authUser.id,
    email: authUser.email,
    username: authUser.email,
    name: profile?.name || authUser.email,
    avatar: (profile?.name?.[0] || authUser.email?.[0] || "U").toUpperCase(),
    role_key: roleKey,
    role: permissions.label,
    permissions,
    profile,
  };
}