"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type CategoryOption = {
  _id: string;
  name: string;
  image?: string;
};

type CategorySelectProps = {
  categories: CategoryOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
};

/** Matches dashboard form inputs (e.g. brand field on add product). */
export const categorySelectTriggerClassName =
  "h-12 min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 py-0 pl-2 pr-3 text-sm text-gray-900 shadow-none data-[size=default]:h-12 data-[size=sm]:h-12 focus-visible:border-teal-500 focus-visible:ring-4 focus-visible:ring-teal-500/10 [&_[data-slot=select-value]]:text-gray-500";

function CategoryOptionRow({ category }: { category: CategoryOption }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-3">
      <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs font-medium text-muted-foreground">
            {category.name.charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      <span className="truncate font-medium">{category.name}</span>
    </span>
  );
}

export function CategorySelect({
  categories,
  value,
  onValueChange,
  placeholder = "Select Category",
  triggerClassName,
}: CategorySelectProps) {
  const selected = categories.find((category) => category._id === value);

  return (
    <Select
      value={value || null}
      onValueChange={(next) => onValueChange(next ?? "")}
    >
      <SelectTrigger
        className={cn(categorySelectTriggerClassName, triggerClassName)}
      >
        <span className="flex min-w-0 flex-1 items-center py-2.5">
          {selected ? (
            <CategoryOptionRow category={selected} />
          ) : (
            <SelectValue placeholder={placeholder} className="py-0" />
          )}
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72 w-(--anchor-width) p-1.5">
        {categories.map((category) => (
          <SelectItem
            key={category._id}
            value={category._id}
            className="cursor-pointer rounded-xl py-3 pr-10 pl-3"
          >
            <CategoryOptionRow category={category} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
