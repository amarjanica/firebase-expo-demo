import { SendEmailForm, SendEmailFormSchema, SendEmailFormWithToken } from '@/email/schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet } from 'react-native';
import { sendEmail } from '@/email/api';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { getRecaptchaToken } from '@/recaptcha';

const Page = () => {
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<SendEmailForm>({
    resolver: zodResolver(SendEmailFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const sendFeedback = async (data: SendEmailFormWithToken) => {
    setLoading(true);
    try {
      const token = await getRecaptchaToken('feedback');
      const sendResult = await sendEmail({
        ...data,
        platform: Platform.OS,
        token,
      });
      if (sendResult.data.success) {
        reset();
        Alert.alert('Success', 'Email sent successfully');
      } else {
        Alert.alert('Error', 'Failed to send email');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.root]}
      keyboardShouldPersistTaps={true}>
      <Text variant="titleSmall">Contact Screen</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              mode="outlined"
              error={!!errors.name}
            />
            {!!errors.name && (
              <HelperText
                type="error"
                visible={true}>
                {errors.name.message}
              </HelperText>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="from"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              error={!!errors.from}
            />
            {!!errors.from && (
              <HelperText
                type="error"
                visible={true}>
                {errors.from.message}
              </HelperText>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="subject"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Subject"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.subject}
            />
            {!!errors.subject && (
              <HelperText
                type="error"
                visible={true}>
                {errors.subject.message}
              </HelperText>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label="Message"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              mode="outlined"
              error={!!errors.message}
              style={{ minHeight: 120 }}
            />
            {!!errors.message && (
              <HelperText
                type="error"
                visible={true}>
                {errors.message.message}
              </HelperText>
            )}
          </>
        )}
      />
      <Button
        onPress={handleSubmit(sendFeedback)}
        disabled={loading || !isValid}
        loading={loading}
        mode="contained">
        Send
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 16,
    gap: 8,
    // width: '100%',
  },
});

export default Page;
