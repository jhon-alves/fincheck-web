import { EditAccountModal, NewAccountModal } from '../components/Dashboard/modals';
import { useDashboard } from '../components/Dashboard';
import {
  TransactionDetailDrawer,
  TransactionFormDrawer,
} from '../components/Transactions';

/** Drawers e modais que qualquer página pode abrir (via DashboardContext). */
export function GlobalDrawers() {
  const { accountBeingEdited } = useDashboard();

  return (
    <>
      <TransactionDetailDrawer />
      <TransactionFormDrawer />
      <NewAccountModal />
      {accountBeingEdited && <EditAccountModal key={accountBeingEdited.id} />}
    </>
  );
}
