"use client";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderButton } from "@/components/loader-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addUserInfo } from "../actions";
import { useTransition } from "react";
import { userInfoSchema } from "../type";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function UserInfo() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      userName: "",
      role: "candidate",
    },
  });

  async function onSubmit(values: z.infer<typeof userInfoSchema>) {
    startTransition(async () => {
      try {
        await addUserInfo(values);
        toast.success("Profile created successfully as candidate.");
        if (values.role === "candidate") {
          router.push("/candidate/dashboard");
        } else if (values.role === "recruiter") {
          router.push("/recruiter/dashboard");
        } else {
          toast.error("Invalid role");
        }
      } catch (error) {
        console.log("error-", error);
        console.error("Full error details:", error);
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full"
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="candidate" />
                    </FormControl>
                    <FormLabel className="font-normal">Candidate</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="recruiter" />
                    </FormControl>
                    <FormLabel className="font-normal">Recruiter</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton isLoading={isPending} className="w-full" type="submit">
          Submit
        </LoaderButton>
      </form>
    </Form>
  );
}
