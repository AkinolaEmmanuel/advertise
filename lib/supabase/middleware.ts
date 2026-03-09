import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.last_sign_in_at) {
    const lastSignIn = new Date(user.last_sign_in_at).getTime();
    const now = new Date().getTime();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    
    if (now - lastSignIn > twoDaysInMs) {
      await supabase.auth.signOut();
      const logoutResponse = NextResponse.redirect(new URL("/login?error=session_expired", request.url));
      // Clear cookies from the response by letting current setAll process if it happens
      return logoutResponse;
    }
  }

  const { pathname } = request.nextUrl;

  // Protected routes check
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    // Check brand status for dashboard users
    if (pathname.startsWith("/dashboard")) {
      const { data: brand } = await supabase
        .from("brands")
        .select("subscription_status, is_flagged")
        .eq("user_id", user.id)
        .single();

      if (brand) {
        if (brand.is_flagged) {
          await supabase.auth.signOut();
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("error", "Your account has been suspended.");
          return NextResponse.redirect(url);
        }

        const isExpired = brand.subscription_status === "expired" || brand.subscription_status === "cancelled";
        if (isExpired && pathname !== "/dashboard/renew" && pathname !== "/dashboard/settings") {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard/renew";
          return NextResponse.redirect(url);
        }
      }
    }
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
