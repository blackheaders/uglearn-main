"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cuboid, PackagePlus } from "lucide-react";
import Link from "next/link";
import UploadPopup from "@/components/UploadPopup";

const courseSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long.",
  }),
  description: z.string().min(8, {
    message: "Description must be at least 8 characters long.",
  }),
  imageUrl: z.string().url({
    message: "Invalid URL format for imageUrl.",
  }),
  videoUrl: z.string().optional(),
  university: z.string().min(2, {
    message: "University name must be at least 2 characters long.",
  }),
  program: z.string().min(2, {
    message: "Program name must be at least 2 characters long.",
  }),
  semester: z.string().min(1, {
    message: "Semester is required.",
  }),
  price: z.number().min(0, {
    message: "Price must be at least 0.",
  }),
  gdlink: z.string().optional(),
});

export default function Courses() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  //   const [email, setEmail] = useState("");
  //   const [adminPassword, setAdminPassword] = useState("");
  const [uploadField, setUploadField] = useState<
    "imageUrl" | "videoUrl" | null
  >(null); // Track which field to update
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      program: "",
      university: "",
      semester: "",
      videoUrl: "",
      price: 0,
      gdlink: "",
    },
  });

  const handleUploadSuccess = (url: string) => {
    if (uploadField) {
      form.setValue(uploadField, url);
      setIsUploadPopupOpen(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    setIsLoading(true);
    try {
      await axios.post("/api/admin/course", data);
      toast("course succesfully created");
      router.push("/admin");
    } catch (error: any) {
      console.log(error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper my-16 flex flex-col p-10 gap-4">
      <section className="my-4 flex items-center gap-2 rounded-lg border-2 bg-primary/5 p-4">
        <Cuboid size={18} />
        <Link href="/admin/content" className="text-lg font-semibold">
          <h2 className="text-md font-bold">View Courses</h2>
        </Link>
      </section>

      <Accordion
        defaultValue="add-new-course"
        className="rounded-2xl border-2 p-4"
        type="single"
        collapsible>
        <AccordionItem value="add-new-course">
          <AccordionTrigger className="p-6 text-2xl font-bold">
            <div className="flex flex-col gap-4">
              <PackagePlus size={40} />
              New course
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid w-full grid-cols-1 lg:grid-cols-7">
              <div className="col-span-1 p-6 text-sm font-semibold text-gray-400 lg:col-span-2">
                Create new course for UG Learn community and let user explore
                new courses
              </div>
              <div className="col-span-1 p-4 lg:col-span-5">
                <Card className="border-2 bg-background">
                  <CardHeader>
                    {/* <CardTitle>Create a new course</CardTitle> */}
                    <CardTitle>Fill in the course details below</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 p-4 pt-0">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 lg:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }: { field: any }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-3"
                                  placeholder="Enter the Course name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    className="h-12 px-3"
                                    placeholder="Image URL"
                                    {...field}
                                    disabled={!!field.value}
                                  />
                                </FormControl>
                                <Button
                                  onClick={() => {
                                    setUploadField("imageUrl");
                                    setIsUploadPopupOpen(true);
                                  }}
                                  type="button">
                                  Upload
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }: { field: any }) => (
                            <FormItem className="col-span-1 lg:col-span-2">
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="h-12 px-3"
                                  placeholder="Enter the Description of course"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      
                    
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter price"
                                  {...field}
                                  value={value}
                                  onChange={(e) => onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter university name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="program"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Program</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter program name (e.g., BTech, BBA)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="semester"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Semester</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter semester (e.g., 1st, 2nd)"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Video URL (optional)</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    className="h-12 px-3"
                                    placeholder="Video URL"
                                    {...field}
                                    disabled={!!field.value}
                                  />
                                </FormControl>
                                <Button
                                  onClick={() => {
                                    setUploadField("videoUrl");
                                    setIsUploadPopupOpen(true);
                                  }}
                                  type="button">
                                  Upload
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gdlink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gdlink (If you want to add direct link) (optional)</FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 px-3"
                                  placeholder="Enter the Gdlink of course"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="lg:col-span-2">
                          {isLoading ? (
                            <Button>Loading...</Button>
                          ) : (
                            <Button className="w-[20%]" type="submit">
                              Create
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {isUploadPopupOpen && <UploadPopup onSuccess={handleUploadSuccess} onClose={() => setIsUploadPopupOpen(false)} />}
    </div>
  );
}
