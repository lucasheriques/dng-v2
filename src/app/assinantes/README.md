# Área do Assinante

Esta página contém recursos exclusivos para assinantes pagos da newsletter Dev na Gringa.

## Estrutura

- `page.tsx`: Componente servidor que pré-carrega os dados de autenticação
- `client-page.tsx`: Componente cliente que renderiza a interface do usuário
- `layout.tsx`: Define os metadados da página

## Integração com Google Calendar

Atualmente, a página está usando dados mockados para os eventos. Para implementar a integração com o Google Calendar, siga os passos abaixo:

### 1. Configurar a API do Google Calendar

1. Crie um projeto no Google Cloud Console
2. Ative a API do Google Calendar
3. Crie uma chave de API com acesso à API do Google Calendar

### 2. Configurar o Convex

1. Implemente o arquivo `convex/calendar.ts` conforme o modelo fornecido
2. Adicione a tabela `calendarEvents` ao schema do Convex
3. Configure as variáveis de ambiente no Convex:

```bash
npx convex env set GOOGLE_CALENDAR_API_KEY "sua-chave-api"
npx convex env set GOOGLE_CALENDAR_ID "id-do-seu-calendario"
```

### 3. Para calendários privados

Se o calendário for privado (acessível apenas por você e membros do seu Google Group), você precisará usar uma conta de serviço:

1. Crie uma conta de serviço no Google Cloud Console
2. Conceda acesso à conta de serviço ao seu calendário
3. Baixe a chave da conta de serviço como JSON
4. Configure a chave da conta de serviço como variável de ambiente:

```bash
npx convex env set GOOGLE_SERVICE_ACCOUNT_KEY "$(cat caminho/para/sua-chave-conta-servico.json)"
```

5. Implemente a função `fetchEventsWithServiceAccount` em `calendar.ts` usando a biblioteca `googleapis`

### 4. Atualizar o hook useCalendarEvents

Após implementar a API no Convex, atualize o hook `useCalendarEvents` em `src/use-cases/use-calendar-events.ts` para usar a API real em vez dos dados mockados:

```typescript
export function useCalendarEvents() {
  const result = useQuery(api.calendar.getEvents);

  return {
    events: (result?.events || []) as CalendarEvent[],
    isLoading: result === undefined,
    isRefreshing: result?.isRefreshing || false,
  };
}
```
