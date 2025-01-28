import { useForm, UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/components/schema/InputForm/types';
import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from '@/components/chakra/provider';

export const createMockForm = (defaultValues?: Partial<FormValues>): UseFormReturn<FormValues> => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      label: '',
      type: 'dropdown',
      required: false,
      options: [],
      description: '',
      actionType: '',
      ...defaultValues,
    },
  });
  return form;
};

export const renderWithProviders = (ui: ReactElement) => {
  return render(
    <Provider>
      {ui}
    </Provider>
  );
}; 