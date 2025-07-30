import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Eye, EyeOff, Plus, User } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <form className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-muted-foreground text-balance">
              Sign up for your z-news account
            </p>
          </div>

          {/* Image Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="group bg-muted hover:border-accent relative flex size-24 cursor-pointer items-center justify-center rounded-full border border-dashed border-gray-300"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="text-muted-foreground h-10 w-10" />
                )}
                <span className="bg-accent border-accent-foreground text-accent-foreground absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full">
                  <Plus className="h-4 w-4" />
                </span>
              </label>
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-3">
            <label htmlFor="name">Name</label>
            <FormControl
              id="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="grid gap-3">
            <label htmlFor="email">Email</label>
            <FormControl
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="grid gap-3">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <FormControl
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-3">
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="relative">
              <FormControl
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          {/* Signin link */}
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/signin" className="underline underline-offset-4">
              Signin
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
