import { useTranslation } from 'react-i18next';

export function UserCreatePage(): React.JSX.Element {
  const { t } = useTranslation();

  return <h1>{t('pageTitle.userCreate')}</h1>;
}
