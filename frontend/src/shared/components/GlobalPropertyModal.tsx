import { usePropertyModalStore } from '@/shared/store/propertyModalStore';
import { PropertyModal } from '@/features/properties/components/PropertyModal';

export function GlobalPropertyModal() {
  const { property, isOpen, closeModal } = usePropertyModalStore();

  return (
    <PropertyModal
      property={property}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );
}
