import {
  Edit3,
  ImagePlus,
  LoaderCircle,
  PackageOpen,
  PackagePlus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "../../../shared/components/Button";
import { api } from "../../../shared/services/api";
import { errorMessage, uploadMedia } from "../../../shared/services/workflows";

interface PartRecord {
  id: number;
  name: string;
  categoryId: number | null;
  zoneId: number | null;
  compatibleCarId: number | null;
  description: string | null;
  price: number;
  stock: number;
  imageMediaId: number | null;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface ZoneOption {
  id: number;
  code: string;
  name: string;
}

interface CarOption {
  id: number;
  brand: string;
  model: string;
  year: number;
}

interface PartFormState {
  name: string;
  categoryId: string;
  zoneId: string;
  compatibleCarId: string;
  description: string;
  price: string;
  stock: string;
}

const emptyForm: PartFormState = {
  name: "",
  categoryId: "",
  zoneId: "",
  compatibleCarId: "",
  description: "",
  price: "",
  stock: "",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function MechanicPartsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [parts, setParts] = useState<PartRecord[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [cars, setCars] = useState<CarOption[]>([]);
  const [form, setForm] = useState<PartFormState>(emptyForm);
  const [editingPart, setEditingPart] = useState<PartRecord | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadCatalog();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const carById = useMemo(() => new Map(cars.map((car) => [car.id, car])), [cars]);
  const filteredParts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ro");
    if (!normalized) return parts;
    return parts.filter((part) => {
      const car = part.compatibleCarId ? carById.get(part.compatibleCarId) : null;
      return [
        part.name,
        categoryById.get(part.categoryId ?? -1),
        car ? `${car.brand} ${car.model} ${car.year}` : "",
      ].some((value) => value?.toLocaleLowerCase("ro").includes(normalized));
    });
  }, [carById, categoryById, parts, query]);

  async function loadCatalog() {
    setLoading(true);
    setError("");
    try {
      const [partResponse, categoryResponse, zoneResponse, carResponse] = await Promise.all([
        api.get<PartRecord[]>("/parts"),
        api.get<CategoryOption[]>("/parts/categories"),
        api.get<ZoneOption[]>("/vehicle-zones"),
        api.get<CarOption[]>("/car-models"),
      ]);
      setParts(partResponse.data);
      setCategories(categoryResponse.data);
      setZones(zoneResponse.data);
      setCars(carResponse.data);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function refreshParts() {
    const response = await api.get<PartRecord[]>("/parts");
    setParts(response.data);
  }

  function releasePreview() {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }

  function openCreateForm() {
    releasePreview();
    setEditingPart(null);
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(false);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id.toString() ?? "",
      zoneId: zones[0]?.id.toString() ?? "",
      compatibleCarId: cars[0]?.id.toString() ?? "",
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
  }

  function openEditForm(part: PartRecord) {
    releasePreview();
    setEditingPart(part);
    setImageFile(null);
    setImagePreview(part.imageMediaId ? `/api/media/${part.imageMediaId}/content` : null);
    setImageRemoved(false);
    setForm({
      name: part.name,
      categoryId: part.categoryId?.toString() ?? "",
      zoneId: part.zoneId?.toString() ?? "",
      compatibleCarId: part.compatibleCarId?.toString() ?? "",
      description: part.description ?? "",
      price: part.price.toString(),
      stock: part.stock.toString(),
    });
    setError("");
    setSuccess("");
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    releasePreview();
    setFormOpen(false);
    setEditingPart(null);
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(false);
    setForm(emptyForm);
  }

  function updateField(field: keyof PartFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Imaginea trebuie să fie în format PNG sau JPG.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Imaginea nu poate depăși 10 MB.");
      return;
    }
    releasePreview();
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageRemoved(false);
    setError("");
  }

  function removeImage() {
    releasePreview();
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
  }

  async function savePart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !form.categoryId || !form.zoneId || !form.compatibleCarId) {
      setError("Completează numele, categoria, zona și compatibilitatea piesei.");
      return;
    }
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      setError("Prețul și stocul trebuie să fie valori pozitive valide.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    let uploadedMediaId: number | null = null;
    const previousMediaId = editingPart?.imageMediaId ?? null;

    try {
      let imageMediaId = imageRemoved ? null : previousMediaId;
      if (imageFile) {
        const media = await uploadMedia(imageFile);
        uploadedMediaId = media.id;
        imageMediaId = media.id;
      }

      const payload = {
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        zoneId: Number(form.zoneId),
        compatibleCarId: Number(form.compatibleCarId),
        description: form.description.trim() || null,
        price,
        stock,
        imageMediaId,
      };

      if (editingPart) {
        await api.put(`/mechanic/parts/${editingPart.id}`, payload);
      } else {
        await api.post("/mechanic/parts", payload);
      }

      if (previousMediaId && previousMediaId !== imageMediaId) {
        await api.delete(`/media/${previousMediaId}`).catch(() => undefined);
      }
      await refreshParts();
      closeForm();
      setSuccess(editingPart ? "Piesa a fost actualizată." : "Piesa și imaginea au fost salvate.");
    } catch (requestError) {
      if (uploadedMediaId) {
        await api.delete(`/media/${uploadedMediaId}`).catch(() => undefined);
      }
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deletePart(part: PartRecord) {
    if (!window.confirm(`Ștergi piesa „${part.name}”?`)) return;
    setError("");
    setSuccess("");
    try {
      await api.delete(`/mechanic/parts/${part.id}`);
      if (part.imageMediaId) {
        await api.delete(`/media/${part.imageMediaId}`).catch(() => undefined);
      }
      await refreshParts();
      setSuccess("Piesa a fost ștearsă din inventar.");
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">INVENTAR SERVICE</span>
          <h1>Piese și stocuri</h1>
          <p>Gestionează catalogul publicat de atelier.</p>
        </div>
        <Button type="button" onClick={formOpen ? closeForm : openCreateForm}>
          <PackagePlus /> {formOpen ? "Închide formularul" : "Adaugă piesă"}
        </Button>
      </div>

      {error && <div className="inline-error page-error">{error}</div>}
      {success && <div className="inline-success page-success">{success}</div>}

      {formOpen && (
        <form className="glass-card part-form" onSubmit={savePart}>
          <div>
            <span className="panel-label">{editingPart ? "EDITARE PIESĂ" : "PIESĂ NOUĂ"}</span>
            <h2>Detalii catalog</h2>
          </div>

          <div className="upload-field">
            <label className={`upload-zone ${imagePreview ? "has-image" : ""}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Previzualizarea piesei" />
              ) : (
                <>
                  <ImagePlus />
                  <b>Încarcă imaginea piesei</b>
                  <span>PNG sau JPG, maximum 10 MB</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg" onChange={selectImage} />
            </label>
            {imagePreview && (
              <button type="button" className="upload-remove" onClick={removeImage} aria-label="Elimină imaginea">
                <X />
              </button>
            )}
            {imageFile && <span className="upload-file-name">{imageFile.name}</span>}
          </div>

          <div className="field-grid">
            <label>
              <span>Nume piesă</span>
              <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex: Baterie Bosch 70Ah" required />
            </label>
            <label>
              <span>Categorie</span>
              <select value={form.categoryId} onChange={(event) => updateField("categoryId", event.target.value)} required>
                <option value="">Selectează categoria</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label>
              <span>Zonă vehicul</span>
              <select value={form.zoneId} onChange={(event) => updateField("zoneId", event.target.value)} required>
                <option value="">Selectează zona</option>
                {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
              </select>
            </label>
            <label>
              <span>Compatibilitate</span>
              <select value={form.compatibleCarId} onChange={(event) => updateField("compatibleCarId", event.target.value)} required>
                <option value="">Selectează modelul</option>
                {cars.map((car) => <option key={car.id} value={car.id}>{car.brand} {car.model}, {car.year}</option>)}
              </select>
            </label>
            <label>
              <span>Preț (lei)</span>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
            </label>
            <label>
              <span>Stoc</span>
              <input type="number" min="0" step="1" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} required />
            </label>
          </div>

          <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Descrierea piesei..." />
          <div className="form-actions">
            <Button type="submit" disabled={saving}>
              {saving ? <LoaderCircle className="spin-icon" /> : null}
              {saving ? "Se salvează..." : editingPart ? "Actualizează piesa" : "Salvează piesa"}
            </Button>
            <Button type="button" className="secondary" onClick={closeForm} disabled={saving}>Anulează</Button>
          </div>
        </form>
      )}

      <div className="glass-card inventory-toolbar">
        <label className="search-field">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Caută în inventar..." />
        </label>
        <span>{parts.length} produse · {parts.filter((part) => part.stock < 5).length} cu stoc redus</span>
      </div>

      <div className="inventory-table glass-card">
        <div className="table-head"><span>PIESĂ</span><span>COMPATIBILITATE</span><span>PREȚ</span><span>STOC</span><span>ACȚIUNI</span></div>
        {loading && <div className="inventory-loading"><LoaderCircle className="spin-icon" /> Se încarcă inventarul...</div>}
        {!loading && filteredParts.length === 0 && <div className="empty-state"><PackageOpen /><h3>Nu există piese pentru această căutare.</h3></div>}
        {!loading && filteredParts.map((part) => {
          const car = part.compatibleCarId ? carById.get(part.compatibleCarId) : null;
          return (
            <div className="table-row" key={part.id}>
              <div>
                <i className={part.imageMediaId ? "part-thumb" : ""}>
                  {part.imageMediaId ? <img src={`/api/media/${part.imageMediaId}/content`} alt="" /> : <Settings2 />}
                </i>
                <div><b>{part.name}</b><span>{categoryById.get(part.categoryId ?? -1) ?? "Fără categorie"}</span></div>
              </div>
              <span>{car ? `${car.brand} ${car.model}, ${car.year}` : "Compatibilitate generală"}</span>
              <strong>{Number(part.price).toLocaleString("ro-RO", { minimumFractionDigits: 2 })} lei</strong>
              <em className={part.stock < 5 ? "low-stock" : ""}>{part.stock} buc.</em>
              <div className="row-actions">
                <button type="button" onClick={() => openEditForm(part)} aria-label={`Editează ${part.name}`}><Edit3 /></button>
                <button type="button" className="danger-icon" onClick={() => void deletePart(part)} aria-label={`Șterge ${part.name}`}><Trash2 /></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
