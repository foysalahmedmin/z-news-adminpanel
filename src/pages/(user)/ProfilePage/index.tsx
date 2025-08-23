import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { URLS } from "@/config";
import { changePassword } from "@/services/auth.service";
import { fetchSelf, updateSelf } from "@/services/user.service";
import type { ChangePasswordPayload } from "@/types/auth.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch user data
  const {
    data: userResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "self"],
    queryFn: fetchSelf,
  });

  const user = userResponse?.data;

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      image: null as File | null,
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateSelf,
    onSuccess: (data) => {
      toast.success(data?.message || "Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", "self"] });
      setIsEditing(false);
      setPreviewImage(null);
      resetProfile();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully!");
      setIsChangingPassword(false);
      resetPassword();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onProfileSubmit = (data: {
    image?: File | null;
    name: string;
    email: string;
  }) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (
    data: ChangePasswordPayload & { confirm_password: string },
  ) => {
    if (data.new_password !== data.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }

    changePasswordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    resetProfile({
      name: user?.name || "",
      email: user?.email || "",
      image: null,
    });
    setPreviewImage(null);
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    resetPassword();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      "super-admin": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      admin: "bg-red-500/10 text-red-600 dark:text-red-400",
      editor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      author: "bg-green-500/10 text-green-600 dark:text-green-400",
      contributor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      subscriber: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
      user: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusColor = (status: string) => {
    return status === "in-progress"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading profile</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<ErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Profile"
          description="Your profile information"
          slot={<User />}
        />

        {/* Profile Information Card */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="border-border border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-xl font-semibold">
                Profile Information
              </h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                {/* Profile Picture and Basic Info */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={
                        user.image
                          ? URLS.user + "/" + user.image
                          : "/images/avatar.png"
                      }
                      alt={user.name}
                      className="border-border h-24 w-24 rounded-full border-4 object-cover"
                    />
                    {user.is_verified && (
                      <div className="absolute -right-1 -bottom-1 rounded-full bg-green-500 p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-foreground text-2xl font-bold">
                        {user.name}
                      </h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getRoleColor(
                          user.role,
                        )}`}
                      >
                        <Shield className="mr-1 inline h-4 w-4" />
                        {user.role.replace("-", " ")}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
                          user.status,
                        )}`}
                      >
                        {user.status === "in-progress" ? "Active" : "Blocked"}
                      </span>
                      {user.is_verified && (
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                          <CheckCircle className="mr-1 inline h-4 w-4" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      User ID
                    </div>
                    <div className="text-foreground font-mono text-sm">
                      {user._id}
                    </div>
                  </div>
                  {user.password_changed_at && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-muted-foreground mb-1 flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        Last Password Change
                      </div>
                      <div className="text-foreground text-sm">
                        {new Date(user.password_changed_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <img
                        src={
                          previewImage ||
                          user.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}&size=128`
                        }
                        alt={user.name}
                        className="border-border h-24 w-24 rounded-full border-4 object-cover"
                      />
                      <label className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-colors">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          {...registerProfile("image")}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <p>
                        Click the camera icon to change your profile picture.
                      </p>
                      <p>Recommended: Square image, at least 200x200 pixels.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <FormControl.Label>Full Name</FormControl.Label>
                      <FormControl
                        type="text"
                        placeholder="Your name"
                        {...registerProfile("name", {
                          required: "Name is required",
                        })}
                      />
                      {profileErrors.name && (
                        <FormControl.Error>
                          {profileErrors.name.message}
                        </FormControl.Error>
                      )}
                    </div>

                    <div>
                      <FormControl.Label>Email Address</FormControl.Label>
                      <FormControl
                        type="email"
                        placeholder="your.email@example.com"
                        {...registerProfile("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {profileErrors.email && (
                        <FormControl.Error>
                          {profileErrors.email.message}
                        </FormControl.Error>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Password Change Card */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="border-border border-b p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-foreground text-xl font-semibold">
                  Password & Security
                </h2>
                <p className="text-muted-foreground text-sm">
                  Ensure your account is using a strong password
                </p>
              </div>
              {!isChangingPassword && (
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {!isChangingPassword ? (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground font-medium">
                        Password
                      </div>
                      <div className="text-muted-foreground text-sm">
                        ••••••••••••
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {user.password_changed_at && (
                        <span>
                          Changed{" "}
                          {new Date(
                            user.password_changed_at,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  We recommend changing your password regularly to keep your
                  account secure.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                <div className="space-y-4">
                  <div>
                    <FormControl.Label>Current Password</FormControl.Label>
                    <div className="relative">
                      <FormControl
                        type={showPassword.current ? "text" : "password"}
                        placeholder="Enter current password"
                        {...registerPassword("current_password", {
                          required: "Current password is required",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <FormControl.Error>
                        {passwordErrors.current_password.message}
                      </FormControl.Error>
                    )}
                  </div>

                  <div>
                    <FormControl.Label>New Password</FormControl.Label>
                    <div className="relative">
                      <FormControl
                        type={showPassword.new ? "text" : "password"}
                        placeholder="Enter new password"
                        {...registerPassword("new_password", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.new_password && (
                      <FormControl.Error>
                        {passwordErrors.new_password.message}
                      </FormControl.Error>
                    )}
                  </div>

                  <div>
                    <FormControl.Label>Confirm New Password</FormControl.Label>
                    <div className="relative">
                      <FormControl
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...registerPassword("confirm_password", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watchPassword("new_password") ||
                            "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirm_password && (
                      <FormControl.Error>
                        {passwordErrors.confirm_password.message}
                      </FormControl.Error>
                    )}
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">
                      <p className="mb-2 font-medium">Password requirements:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• At least 6 characters long</li>
                        <li>• Must not match your current password</li>
                        <li>
                          • Should include a mix of letters, numbers, and
                          symbols
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelPasswordChange}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
