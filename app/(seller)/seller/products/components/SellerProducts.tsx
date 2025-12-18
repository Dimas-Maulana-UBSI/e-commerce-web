import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSellerProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getValidImage } from "@/lib/getValidImage";
import Link from "next/link";

const SellerProducts: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isError } = useSellerProducts(
    page,
    limit,
    undefined,
    search
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  if (isError)
    return <div className="p-10 text-red-500">Failed to load products</div>;

  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <Link href="/seller/products/form" passHref>
          <Button className="w-full md:w-45" size={`sm`}>
            <Plus width={12} /> Add Product
          </Button>
        </Link>

        <div className="relative mr-2 w-full md:w-65">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="border border-neutral-300 py-2 px-10 rounded-xl w-full bg-white"
          />
          <Search className="absolute text-neutral-500 top-2 left-3 w-5" />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold w-3">No</TableHead>
            <TableHead className="font-bold">Product Info</TableHead>
            <TableHead className="font-bold">Price</TableHead>
            <TableHead className="font-bold">Stock</TableHead>
            <TableHead className="font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Skeleton className="h-6 w-6 rounded-lg" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-sm" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-4 w-20 rounded-lg" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-12 rounded-lg" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-lg" />
                </TableCell>
              </TableRow>
            ))
          ) : data?.products.length == 0 ? (
            <TableRow>
              <TableCell className="font-medium text-center" colSpan={5}>
                <div>No products yet</div>
              </TableCell>
            </TableRow>
          ) : (
            data?.products.map((p, i) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{from + i}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={getValidImage(p.images[0])}
                      alt={p.title}
                      width={50}
                      height={80}
                      className="object-cover rounded-sm"
                      unoptimized
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{p.title}</span>
                      <span className="text-sm text-neutral-600">
                        {p.category.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Rp{p.price.toLocaleString("id-ID")}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Eye
                      width={16}
                      className="cursor-pointer hover:text-primary transition-colors"
                    />
                    <Pencil
                      width={16}
                      className="cursor-pointer hover:text-primary transition-colors"
                    />
                    <Trash2
                      width={16}
                      className="text-accent-red cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {total > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-neutral-800 text-sm">
                Showing {from} to {to} of {total} entries
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft width={15} />
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`text-sm w-8 h-8 rounded-full ${
                          page === i + 1
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-neutral-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight width={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
};

export default SellerProducts;
