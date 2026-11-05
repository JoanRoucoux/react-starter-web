import { useTranslation } from 'react-i18next';

export function UserListPage(): React.JSX.Element {
  const { t } = useTranslation();

  return <h1>{t('pageTitle.users')}</h1>;
}
