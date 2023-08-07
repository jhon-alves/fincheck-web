import { Navbar, Accounts, Transactions } from '../../components';
import { EditAccountModal, NewAccountModal } from '../../components/Home/Accounts';
import { NewTransactionModal } from '../../components/Home/Transactions';
import { HomeContext, HomeProvider } from '../../contexts';

export function HomePage() {
	return (
		<HomeProvider>
			<HomeContext.Consumer>
				{({ accountBeingEdited }) => (
					<>
						<NewAccountModal />
						{accountBeingEdited && <EditAccountModal />}
						<NewTransactionModal />

						<div className="w-full h-full p-4 md:px-8 md:pb-8 md:pt-6 flex flex-col gap-4">
							<Navbar />
							<main className="flex-1 flex flex-col md:flex-row gap-4 max-h-full">
								<div className="w-full md:w-1/2">
									<Accounts />
								</div>
								<div className="w-full md:w-1/2">
									<Transactions />
								</div>
							</main>
						</div>
					</>
				)}
			</HomeContext.Consumer>
		</HomeProvider>
	);
}
