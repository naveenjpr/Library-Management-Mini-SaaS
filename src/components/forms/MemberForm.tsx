"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface MemberFormProps {
  onSubmit: (data: MemberData) => void;
  initialData?: MemberData;
}

export interface MemberData {
  name: string;
  email: string;
  phone?: string;
  membershipType: "basic" | "premium" | "corporate";
}

export const MemberForm: React.FC<MemberFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<MemberData>(
    initialData || {
      name: "",
      email: "",
      phone: "",
      membershipType: "basic",
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(formData);
      if (!initialData) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          membershipType: "basic",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="john@example.com"
        required
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone || ""}
        onChange={handleChange}
        placeholder="+1 (555) 123-4567"
      />

      <div>
        <label
          htmlFor="membershipType"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Membership Type
        </label>
        <select
          id="membershipType"
          name="membershipType"
          value={formData.membershipType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="corporate">Corporate</option>
        </select>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {initialData ? "Update Member" : "Add Member"}
      </Button>
    </form>
  );
};
