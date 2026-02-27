"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface BookingFormProps {
  onSubmit: (data: BookingData) => void;
  initialData?: BookingData;
}

export interface BookingData {
  memberId: string;
  seatId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<BookingData>(
    initialData || {
      memberId: "",
      seatId: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
          memberId: "",
          seatId: "",
          date: "",
          startTime: "",
          endTime: "",
          notes: "",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="memberId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Member
        </label>
        <select
          id="memberId"
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select a member</option>
          <option value="1">John Doe</option>
          <option value="2">Jane Smith</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="seatId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Seat
        </label>
        <select
          id="seatId"
          name="seatId"
          value={formData.seatId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select a seat</option>
          <option value="1">A1</option>
          <option value="2">A2</option>
          <option value="3">A3</option>
        </select>
      </div>

      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <Input
        label="Start Time"
        name="startTime"
        type="time"
        value={formData.startTime}
        onChange={handleChange}
        required
      />

      <Input
        label="End Time"
        name="endTime"
        type="time"
        value={formData.endTime}
        onChange={handleChange}
        required
      />

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          placeholder="Additional notes..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {initialData ? "Update Booking" : "Create Booking"}
      </Button>
    </form>
  );
};
