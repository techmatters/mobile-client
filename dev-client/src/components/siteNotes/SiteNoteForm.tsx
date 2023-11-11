import {useTranslation} from 'react-i18next';
import {FormInput} from 'terraso-mobile-client/components/common/Form';
import {Box} from 'native-base';
import {KeyboardAvoidingView, TextInput} from 'react-native';
import {useRef, useEffect} from 'react';

type SiteNoteFormProps = {
  content: string;
  onChangeContent: (text: string) => void;
  onBlurContent: (e: any) => void;
};

export const SiteNoteForm = ({
  content,
  onChangeContent,
  onBlurContent,
}: SiteNoteFormProps) => {
  const {t} = useTranslation();
  const formInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (formInputRef.current) {
      formInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Box pt={2} pb={4}>
        <KeyboardAvoidingView behavior="height">
          <FormInput
            ref={formInputRef}
            padding={0}
            borderWidth={0}
            backgroundColor={'transparent'}
            name="content"
            placeholder={t('site.notes.placeholder_text')}
            value={content}
            onChangeText={onChangeContent}
            onBlur={onBlurContent}
            multiline
            textAlignVertical="top"
          />
        </KeyboardAvoidingView>
      </Box>
    </>
  );
};
