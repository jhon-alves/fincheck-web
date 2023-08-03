import { Modal } from '../../Shared';

interface FiltersModalProps {
  open: boolean;
  onClose(): void;
}

export function FiltersModal({ open, onClose }: FiltersModalProps) {
	return (
		<Modal open={open} onClose={onClose} title="Filtros">
			<div className="">
				<span className="text-lg font-medium">Conta</span>

				<div>
					<button>

					</button>
				</div>
			</div>
			<div>
				<span className="text-lg font-medium">Ano</span>

				<div>
					<button>

					</button>
				</div>
			</div>
			<button className="bg-teal-900 rounded-xl text-white w-full p-3">
        Aplicar Filtros
			</button>
		</Modal>
	);
}
