export type UserType = "individual" | "organization";

export interface Profile {
  isDisabled: boolean;
  info: {
    firstName?: string;
    lastName?: string;
    organizationName?: string;
    userType: UserType;
    description?: string;
    profileSlug: string;
    isPrivate: boolean;
    isABusinessSeller: boolean;
    businessAddress?: string;
    businessEmail?: string;
    businessPhoneNumber?: string;
  };
  socialUrls?: {
    website?: string;
    facebook?: string;
    x?: string;
    instagram?: string;
  };
  images?: {
    profilePicture?: string;
    coverPhoto?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  profile: Profile | null;
}
