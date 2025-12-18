"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ListFilter, X } from "lucide-react";
import FilterList from "./FilterList";
import { SortType } from "@/types/Sort.type";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Product as ProductType } from "@/types/Product";
import Link from "next/link";
import Product from "../../components/Product";
import { Button } from "@/components/ui/button";

const CatalogPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sort, setSort] = useState<SortType>("newest");

  // the real values used for filtering
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // temporary values while typing
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");

  const { data, isLoading, isError, isPending } = useProducts(
    page,
    limit,
    selectedCategories[selectedCategories.length - 1],
    minPrice,
    maxPrice,
    sort
  );

  // debounce minPrice
  useEffect(() => {
    const handler = setTimeout(() => {
      setMinPrice(tempMinPrice === "" ? null : Number(tempMinPrice));
    }, 1000); // 1s delay

    return () => clearTimeout(handler);
  }, [tempMinPrice]);

  // debounce maxPrice
  useEffect(() => {
    const handler = setTimeout(() => {
      setMaxPrice(tempMaxPrice === "" ? null : Number(tempMaxPrice));
    }, 1000);

    return () => clearTimeout(handler);
  }, [tempMaxPrice]);

  const products = data?.products ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  const sortOptions: { value: SortType; label: string }[] = [
    { value: "--", label: "Default" },
    { value: "newest", label: "Newest" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
    { value: "popular", label: "Popular" },
  ];

  const handleCategoryChange = (id: number, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTempMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTempMaxPrice(e.target.value);
  };

  if (isError)
    return <div className="p-10 text-red-500">Failed to load products</div>;

  return (
    <div className="px-4 md:px-30 py-7">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-4">
        <div className="w-full">
          <h1 className="font-bold mb-6">
            <span className="inline md:hidden display-xs">Catalog</span>
            <span className="hidden md:inline display-md">Catalog</span>
          </h1>

          <div className="flex items-start gap-6">
            <div className="hidden md:inline">
              <FilterList
                selected={selectedCategories}
                onChange={handleCategoryChange}
                onChangeMinPrice={handleMinPriceChange}
                onChangeMaxPrice={handleMaxPriceChange}
                valueMinPrice={tempMinPrice}
                valueMaxPrice={tempMaxPrice}
              />
            </div>

            <div className="flex flex-col w-full">
              <div className="flex justify-between items-end md:items-center gap-2 w-full">
                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="text-xs md:text-md">
                    Showing {data?.pagination.total} products
                  </span>
                  <Drawer direction="left">
                    <DrawerTrigger asChild>
                      <div className="w-full flex justify-between items-center border border-neutral-300 rounded-xl p-3 cursor-pointer h-11 md:hidden">
                        <span className="text-xs">Filter</span>
                        <ListFilter className="w-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle></DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                      </DrawerHeader>
                      <div className="h-dvh w-full fixed overflow-y-scroll bg-white p-4">
                        <FilterList
                          selected={selectedCategories}
                          onChange={handleCategoryChange}
                          onChangeMinPrice={handleMinPriceChange}
                          onChangeMaxPrice={handleMaxPriceChange}
                          valueMinPrice={tempMinPrice}
                          valueMaxPrice={tempMaxPrice}
                        />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

                <div className="flex items-center gap-3 justify-end w-full">
                  <span className="hidden md:inline text-md font-bold">
                    Sort
                  </span>
                  <Select
                    onValueChange={(val) => setSort(val as SortType)}
                    value={sort}
                  >
                    <SelectTrigger className="w-full md:w-42 rounded-xl">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 my-4 md:my-6">
                {isLoading ? (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-100 w-full rounded-lg" />
                    ))}
                  </>
                ) : (
                  products.map((p: ProductType) => (
                    <Link
                      key={p.id}
                      href={`/detail/${p.slug}/${p.id}`}
                      passHref
                    >
                      <Product
                        key={p.id}
                        productImg={p.images[0]}
                        title={p.title}
                        price={p.price}
                        rating={p.rating}
                        qtySold={p.soldCount}
                        isVerified={true}
                        MarketName={p.shop.name}
                      />
                    </Link>
                  ))
                )}
              </div>

              {/* Load More */}
              {page < totalPages && (
                <div className="mb-10 md:mb-25 flex justify-center">
                  <Button
                    onClick={() => setLimit((prev) => prev + 8)}
                    className="rounded-xl w-40 md:w-55 cursor-pointer"
                    variant={"outline"}
                  >
                    {isPending ? "Loading" : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
