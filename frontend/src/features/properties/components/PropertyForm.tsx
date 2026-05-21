import { useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema } from '../schemas';
import type { PropertyFormValues } from '../schemas';

interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (data: PropertyFormValues) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';
const errorClass = 'text-xs text-red-500 mt-1';
const sectionClass = 'bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4';
const sectionTitle = 'font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm';

type SelectOption = { value: string; label: string };

const CURRENCIES: SelectOption[] = [
  { value: 'MXN', label: 'Peso Mexicano (MXN)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
];

const PROPERTY_TYPES: SelectOption[] = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
];

const PROPERTY_STATUSES: SelectOption[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendido' },
  { value: 'rented', label: 'Alquilado' },
];

export function PropertyForm({ defaultValues, onSubmit, isLoading, isEdit = false }: PropertyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as Resolver<PropertyFormValues>,
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      currency: 'MXN',
      type: 'house',
      status: 'available',
      address: '',
      city: '',
      state: '',
      country: 'México',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      images: [],
      ...defaultValues,
    },
  });


  const images = watch('images') ?? [];

  const handleImageUrlAdd = () => {
    const input = fileInputRef.current;
    if (!input) return;
    const url = (document.getElementById('image-url-input') as HTMLInputElement)?.value?.trim();
    if (url) {
      setValue('images', [...images, url], { shouldValidate: true });
      (document.getElementById('image-url-input') as HTMLInputElement).value = '';
    }
  };

  const handleRemoveImage = (idx: number) => {
    setValue('images', images.filter((_, i) => i !== idx), { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Información básica */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>
          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
          Información básica
        </h2>

        <div>
          <label htmlFor="title" className={labelClass}>Título *</label>
          <input
            id="title"
            type="text"
            placeholder="Ej: Amplia casa con jardín en zona residencial"
            className={inputClass}
            {...register('title')}
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Descripción</label>
          <textarea
            id="description"
            placeholder="Describe las características más importantes de la propiedad..."
            rows={4}
            className={`${inputClass} resize-none`}
            {...register('description')}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>
      </div>

      {/* Precio y clasificación */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>
          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
          Precio y clasificación
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className={labelClass}>Precio *</label>
            <input
              id="price"
              type="number"
              min={0}
              placeholder="0"
              className={inputClass}
              {...register('price')}
            />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="currency" className={labelClass}>Moneda *</label>
            <select id="currency" className={inputClass} {...register('currency')}>
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.currency && <p className={errorClass}>{errors.currency.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className={labelClass}>Tipo *</label>
            <select id="type" className={inputClass} {...register('type')}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {errors.type && <p className={errorClass}>{errors.type.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Estado *</label>
            <select id="status" className={inputClass} {...register('status')}>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>
          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
          Ubicación
        </h2>

        <div>
          <label htmlFor="address" className={labelClass}>Dirección *</label>
          <input
            id="address"
            type="text"
            placeholder="Calle, número, colonia"
            className={inputClass}
            {...register('address')}
          />
          {errors.address && <p className={errorClass}>{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="city" className={labelClass}>Ciudad *</label>
            <input id="city" type="text" placeholder="Ciudad de México" className={inputClass} {...register('city')} />
            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>Estado *</label>
            <input id="state" type="text" placeholder="CDMX" className={inputClass} {...register('state')} />
            {errors.state && <p className={errorClass}>{errors.state.message}</p>}
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>País *</label>
            <input id="country" type="text" placeholder="México" className={inputClass} {...register('country')} />
            {errors.country && <p className={errorClass}>{errors.country.message}</p>}
          </div>
        </div>
      </div>

      {/* Características */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>
          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
          Características
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className={labelClass}>Recámaras</label>
            <input
              id="bedrooms"
              type="number"
              min={0}
              max={20}
              className={inputClass}
              {...register('bedrooms')}
            />
            {errors.bedrooms && <p className={errorClass}>{errors.bedrooms.message}</p>}
          </div>
          <div>
            <label htmlFor="bathrooms" className={labelClass}>Baños</label>
            <input
              id="bathrooms"
              type="number"
              min={0}
              max={20}
              step={0.5}
              className={inputClass}
              {...register('bathrooms')}
            />
            {errors.bathrooms && <p className={errorClass}>{errors.bathrooms.message}</p>}
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Área (m²) *</label>
            <input
              id="area"
              type="number"
              min={0}
              className={inputClass}
              {...register('area')}
            />
            {errors.area && <p className={errorClass}>{errors.area.message}</p>}
          </div>
        </div>
      </div>

      {/* Imágenes */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>
          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
          Imágenes
        </h2>

        {/* URL input */}
        <div className="flex gap-2">
          <input
            id="image-url-input"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            className={`${inputClass} flex-1`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleImageUrlAdd();
              }
            }}
          />
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" />
          <button
            type="button"
            onClick={handleImageUrlAdd}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            + Agregar
          </button>
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100">
                <img
                  src={url}
                  alt={`Imagen ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-md">
                    Principal
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  aria-label="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
            Agrega al menos una imagen usando la URL
          </p>
        )}

        {errors.images && <p className={errorClass}>{errors.images.message}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {isLoading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear propiedad'}
        </button>
      </div>
    </form>
  );
}
