// Demo authentication for development/testing
export const demoAuth = {
  users: [
    {
      uid: "demo-user-1",
      email: "demo@fynance.com",
      displayName: "Demo User",
      password: "demo123",
    },
    {
      uid: "demo-user-2",
      email: "admin@fynance.com",
      displayName: "Admin User",
      password: "admin123",
    },
  ],

  // Family/household ID for shared data
  familyId: "family-demo-001",

  async signIn(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Store demo user in localStorage
    localStorage.setItem(
      "demoUser",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        familyId: this.familyId,
      })
    );

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      familyId: this.familyId,
    };
  },

  async signOut() {
    localStorage.removeItem("demoUser");
  },

  getCurrentUser() {
    const stored = localStorage.getItem("demoUser");
    return stored ? JSON.parse(stored) : null;
  },
};

// Check if we're in demo mode (no valid Firebase config)
// Since we now have real Firebase config, demo mode is disabled
export const isDemoMode = false;
