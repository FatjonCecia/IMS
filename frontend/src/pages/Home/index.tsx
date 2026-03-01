import { useState, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import {
  useGetBatchesQuery,
  useActivateOfferMutation,
  useDeactivateOfferMutation,
  useCreateBatchMutation,
} from "../../provider/queries/Batch.query";

import { useGetLocationsQuery } from "../../provider/queries/Location.query";
import { getBatchState } from "../../domain/batchState";

type Batch = {
  _id?: string;
  id?: string;
  title: string;
  quantity: number;
  basePrice: number;
  offerPrice?: number | null;
  expirationDate: string;
  locationId: string;
};

type Location = {
  _id: string;
  name: string;
  type: string;
  status: string;
};

const stateOptions = [
  { label: "All States", value: null },
  { label: "Available", value: "available" },
  { label: "Near Expiry", value: "near_expiry" },
  { label: "In Offer", value: "in_offer" },
  { label: "Expired", value: "expired" },
  { label: "Sold Out", value: "sold_out" },
];

const Home = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("user");

  const {
    data: batches = [],
    isLoading,
    isError,
    refetch,
  } = useGetBatchesQuery(undefined, {
    skip: !token,
  });

  const { data: locations = [] } = useGetLocationsQuery(undefined, {
    skip: !token,
  });

  const [activateOffer, { isLoading: activating }] =
    useActivateOfferMutation();
  const [deactivateOffer] = useDeactivateOfferMutation();
  const [createBatch, { isLoading: creating }] =
    useCreateBatchMutation();

  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [offerPrice, setOfferPrice] = useState<number | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);

  const [newBatch, setNewBatch] = useState({
    title: "",
    quantity: 0,
    basePrice: 0,
    expirationDate: "",
    locationId: "",
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const safeBatches = Array.isArray(batches) ? batches : [];

  const locationOptions = useMemo(() => {
    return [
      { label: "All Locations", value: null },
      ...locations.map((loc: Location) => ({
        label: `${loc.name} (${loc.type})`,
        value: loc._id,
      })),
    ];
  }, [locations]);

  const filteredBatches = useMemo(() => {
    return safeBatches.filter((batch: Batch) => {
      const state = getBatchState(batch);
      const stateMatch = selectedState ? state === selectedState : true;
      const locationMatch = selectedLocation
        ? batch.locationId === selectedLocation
        : true;
      return stateMatch && locationMatch;
    });
  }, [safeBatches, selectedState, selectedLocation]);

  const statusTemplate = (rowData: Batch) => {
    const state = getBatchState(rowData);

    const severityMap: Record<string, any> = {
      available: "success",
      near_expiry: "warning",
      in_offer: "info",
      expired: "danger",
      sold_out: "secondary",
    };

    return (
      <Tag
        value={state.replace("_", " ").toUpperCase()}
        severity={severityMap[state]}
        className="text-xs"
      />
    );
  };

  const expirationTemplate = (rowData: Batch) => {
    const expiration = new Date(rowData.expirationDate);
    if (isNaN(expiration.getTime())) return <span>-</span>;

    const now = new Date();
    const hoursLeft =
      (expiration.getTime() - now.getTime()) / (1000 * 60 * 60);

    let color = "text-green-600";
    if (hoursLeft < 0) color = "text-red-600 font-semibold";
    else if (hoursLeft < 24)
      color = "text-orange-500 font-semibold";

    return <span className={color}>{expiration.toLocaleString()}</span>;
  };

  const getBatchId = (batch: Batch) => batch._id || batch.id || "";

  const openActivateDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setOfferPrice(batch.offerPrice ?? null);
    setDialogVisible(true);
  };

  const handleActivateOffer = async () => {
    if (!selectedBatch || offerPrice === null) return;

    const id = getBatchId(selectedBatch);

    await activateOffer({
      id,
      offerPrice,
    });

    setDialogVisible(false);
  };

  // 🔥 FINAL FIX FOR 400 ERROR (Backend validation safe)
  const handleCreateBatch = async () => {
    if (
      !newBatch.title.trim() ||
      !newBatch.locationId ||
      !newBatch.expirationDate
    ) {
      alert("All fields are required");
      return;
    }

    const expiration = new Date(newBatch.expirationDate);

    if (isNaN(expiration.getTime())) {
      alert("Invalid expiration date");
      return;
    }

    if (expiration <= new Date()) {
      alert("Expiration date must be in the future");
      return;
    }

    try {
      const payload = {
        title: newBatch.title.trim(),
        quantity: Number(newBatch.quantity),
        basePrice: Number(newBatch.basePrice),
        expirationDate: expiration.toISOString(),
        locationId: newBatch.locationId, // MUST be Mongo ObjectId
      };

      console.log("SENDING PAYLOAD:", payload);

      await createBatch(payload).unwrap();

      await refetch(); // 🔥 refresh table after create

      setNewBatch({
        title: "",
        quantity: 0,
        basePrice: 0,
        expirationDate: "",
        locationId: "",
      });

      setCreateDialogVisible(false);
    } catch (error: any) {
      console.error("Create batch failed:", error);
      alert(error?.data?.message || "Backend validation failed");
    }
  };

  if (!token) {
    return <div className="p-6">Please login first.</div>;
  }

  if (isLoading) return <div className="p-6">Loading inventory...</div>;
  if (isError) return <div className="p-6 text-red-500">API Error</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        <Button
          label="Add Batch"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setCreateDialogVisible(true)}
        />
      </div>

      <div className="flex gap-4">
        <Dropdown
          value={selectedState}
          options={stateOptions}
          onChange={(e) => setSelectedState(e.value)}
          placeholder="Filter by State"
          className="w-56"
        />

        <Dropdown
          value={selectedLocation}
          options={locationOptions}
          onChange={(e) => setSelectedLocation(e.value)}
          placeholder="Filter by Location"
          className="w-56"
        />
      </div>

      <DataTable
        value={filteredBatches}
        paginator
        rows={10}
        responsiveLayout="scroll"
        emptyMessage="No inventory batches available"
      >
        <Column field="title" header="Batch Title" />
        <Column field="quantity" header="Quantity" />
        <Column
          field="basePrice"
          header="Base Price"
          body={(row: Batch) => `€${row.basePrice}`}
        />
        <Column header="Expiration" body={expirationTemplate} />
        <Column header="Status" body={statusTemplate} />
      </DataTable>

      <Dialog
        header="Create New Batch"
        visible={createDialogVisible}
        style={{ width: "450px" }}
        onHide={() => setCreateDialogVisible(false)}
      >
        <div className="flex flex-col gap-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Batch Title"
            value={newBatch.title}
            onChange={(e) =>
              setNewBatch({ ...newBatch, title: e.target.value })
            }
          />

          <InputNumber
            className="w-full"
            placeholder="Quantity"
            value={newBatch.quantity}
            onValueChange={(e) =>
              setNewBatch({
                ...newBatch,
                quantity: e.value ?? 0,
              })
            }
          />

          <InputNumber
            className="w-full"
            placeholder="Base Price (€)"
            value={newBatch.basePrice}
            onValueChange={(e) =>
              setNewBatch({
                ...newBatch,
                basePrice: e.value ?? 0,
              })
            }
            mode="currency"
            currency="EUR"
            locale="en-US"
          />

          <input
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            className="w-full p-2 border rounded"
            value={newBatch.expirationDate}
            onChange={(e) =>
              setNewBatch({
                ...newBatch,
                expirationDate: e.target.value,
              })
            }
          />

          <Dropdown
            value={newBatch.locationId}
            options={locations.map((loc: Location) => ({
              label: `${loc.name} (${loc.type})`,
              value: loc._id,
            }))}
            onChange={(e) =>
              setNewBatch({
                ...newBatch,
                locationId: e.value,
              })
            }
            placeholder="Select Location"
            className="w-full"
          />

          <Button
            label="Create Batch"
            icon="pi pi-check"
            loading={creating}
            onClick={handleCreateBatch}
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Home;