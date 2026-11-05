import { useTranslation } from 'react-i18next';

export function {{featurePascal}}Page(): React.JSX.Element {
  const { t } = useTranslation('{{feature}}');

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance">{t('title')}</h1>
      <p className="max-w-xl text-lg text-(--muted-foreground)">{t('description')}</p>
    </div>
  );
}
