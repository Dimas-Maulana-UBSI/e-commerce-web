"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { InputComp } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextareaComp } from "@/components/ui/TextareaComp";
import { useCategories } from "@/hooks/useCategory";
import React, { useEffect } from "react";
import useSellerProductForm from "./useSellerProductForm";

const SellerProductForm: React.FC = () => {
  const { data, isLoading: isLoadingCategories } = useCategories(1, 20);
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    watch,
    isPending,
  } = useSellerProductForm();
  const images = watch("images");
  const categoryId = watch("categoryId");

  useEffect(() => {}, [images]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputComp
        label="Product name"
        {...register("title")}
        error={errors && errors.title?.message}
      />
      <div className="mb-4">
        <Select
          onValueChange={(val) => setValue("categoryId", Number(val))}
          value={categoryId?.toString()}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {!isLoadingCategories &&
              data?.categories.map((opt) => (
                <SelectItem key={opt.id} value={opt.id.toString()}>
                  {opt.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>
      <InputComp
        label="Price"
        type="number"
        {...register("price", { valueAsNumber: true })}
        error={errors && errors.price?.message}
      />
      <InputComp
        label="Stock"
        type="number"
        {...register("stock", { valueAsNumber: true })}
        error={errors && errors.stock?.message}
      />
      <TextareaComp
        label="Description"
        {...register("description")}
        error={errors && errors.description?.message}
      />

      <ImageUploader
        label="Product Image"
        onFilesChange={(files) => setValue("images", files)}
      />
      {errors.images && <p className="text-red-500">{errors.images.message}</p>}

      <Button
        className="w-full"
        size={"sm"}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};

export default SellerProductForm;
