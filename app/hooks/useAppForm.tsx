import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

export const useAppForm = <T extends FieldValues>(schema: z.ZodSchema<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
  });
  const submit = useSubmit();

  return {
    ...form,
    handleSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      const target = ev.currentTarget;
      form.handleSubmit(() => submit(target))(ev);
    },
  };
};
