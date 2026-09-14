import { StatusCard, StatusTitle, StatusText, RetryButton } from "./status-state.styles";

type StatusKind = "loading" | "error" | "empty";

type StatusStateProps = {
  kind: StatusKind;
  message?: string;
  onRetry?: () => void;
};

const TITLE: Record<StatusKind, string> = {
  loading: "Загружаем оргструктуру",
  error: "Не удалось получить данные",
  empty: "Дерево пустое",
};

const DEFAULT_TEXT: Record<StatusKind, string> = {
  loading: "Запрос к /api/org-tree. Если кэш свежий, этот экран не появится.",
  error: "Ответ сервера недоступен или не прошёл проверку схемы.",
  empty: "Сервер вернул корректный, но пустой список узлов.",
};

const StatusState = ({ kind, message, onRetry }: StatusStateProps) => {
  return (
    <StatusCard role="status" $kind={kind}>
      <StatusTitle>{TITLE[kind]}</StatusTitle>
      <StatusText>{message ?? DEFAULT_TEXT[kind]}</StatusText>
      {onRetry && (
        <RetryButton type="button" onClick={onRetry}>
          Повторить
        </RetryButton>
      )}
    </StatusCard>
  );
};

export { StatusState };
