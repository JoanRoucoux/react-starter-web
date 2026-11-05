import { useTranslation } from 'react-i18next';

export function UserDetailPage(): React.JSX.Element {
  const { t } = useTranslation();

  return <h1>{t('pageTitle.userDetail')}</h1>;
}
