import React from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { authFormSchema } from '@/lib/utils';

interface FormFieldItemProps{
    control: Control<z.infer<typeof authFormSchema>>;
    name : FieldPath<z.infer<typeof authFormSchema>>
    placeholder:string,
    type:string,
    label:string
}

const FormFieldItem = ({ control , name, label,placeholder,type }: FormFieldItemProps) => {
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <div className='form-item'>
                        <FormLabel className='form-label'>
                            {label}
                        </FormLabel>
                        <div className='flex w-full flex-col'>
                            <FormControl>
                                <Input
                                    placeholder={placeholder}
                                    className='input-class'
                                    {...field}
                                    type={type}
                                />
                            </FormControl>
                            <FormMessage className='form-message mt-2' />
                        </div>
                    </div>
                )}
            />
        </>
    )
}

export default FormFieldItem