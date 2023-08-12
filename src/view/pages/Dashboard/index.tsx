import {
  Fab,
  Accounts,
  Transactions,
  DashboardContext,
  DashboardProvider,
} from './components';
import {
  EditAccountModal,
  NewAccountModal,
  NewTransactionModal
} from './modals';
import { Logo, UserMenu } from '../../components';

export function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContext.Consumer>
        {({ accountBeingEdited }) => (
          <div className="h-full w-full p-4 md:px-8 md:pb-8 md:pt-6 flex flex-col gap-4">
            <header className="h-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo className="h-6 text-teal-900" />
                <span className="text-teal-800 font-bold">My Wallet</span>
              </div>
              <UserMenu />
            </header>
            <main className="flex-1 flex flex-col gap-4 md:flex-row">
              <div className="w-full md:w-1/2">
                <Accounts />
              </div>
              <div className="w-full: md:w-1/2">
                <Transactions />
              </div>
            </main>
            <Fab />
            <NewAccountModal />
            <NewTransactionModal />
            {accountBeingEdited && <EditAccountModal />}
          </div>
        )}
      </DashboardContext.Consumer>
    </DashboardProvider>
  );
}
