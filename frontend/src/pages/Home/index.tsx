import { useState, useMemo, useEffect } from "react";
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
  locationId: any;
  state?: string;
};

type Location = {
  _id: string;
  name: string;
  type: string;
  status: string;
};

const ALL_STATES = [
  "available",
  "near_expiry",
  "in_offer",
  "expired",
  "sold_out",
];

const stateOptions = [
  { label: "All States", value: ALL_STATES },
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

  const [activateOffer] = useActivateOfferMutation();
  const [deactivateOffer] = useDeactivateOfferMutation();
  const [createBatch, { isLoading: creating }] =
    useCreateBatchMutation();

  const [selectedState, setSelectedState] =
    useState<string | string[] | null>(ALL_STATES);

  const ALL_LOCATIONS = useMemo(() => {
    return locations.map((loc: Location) => loc._id);
  }, [locations]);

  const [selectedLocation, setSelectedLocation] =
    useState<string | string[] | null>(null);

  useEffect(() => {
    if (ALL_LOCATIONS.length) {
      setSelectedLocation(ALL_LOCATIONS);
    }
  }, [ALL_LOCATIONS]);

  const locationOptions = useMemo(() => {
    return [
      { label: "All Locations", value: ALL_LOCATIONS },
      ...locations.map((loc: Location) => ({
        label: `${loc.name} (${loc.type})`,
        value: loc._id,
      })),
    ];
  }, [locations, ALL_LOCATIONS]);

  const [offerDialogVisible, setOfferDialogVisible] =
    useState(false);
  const [selectedBatch, setSelectedBatch] =
    useState<Batch | null>(null);
  const [offerPrice, setOfferPrice] =
    useState<number | null>(null);

  const [createDialogVisible, setCreateDialogVisible] =
    useState(false);

  const [newBatch, setNewBatch] = useState({
    title: "",
    quantity: 0,
    basePrice: 0,
    expirationDate: "",
    locationId: "",
  });

  const getLocationId = (batch: Batch) => {
    if (!batch.locationId) return null;
    if (typeof batch.locationId === "object") {
      return batch.locationId._id;
    }
    return batch.locationId;
  };

  const getBatchId = (batch: Batch) =>
    batch._id || batch.id || "";

  const safeBatches = Array.isArray(batches) ? batches : [];

  const filteredBatches = useMemo(() => {
    return safeBatches.filter((batch: Batch) => {
      const state = batch.state || getBatchState(batch);

      let stateMatch = true;

      if (Array.isArray(selectedState)) {
        stateMatch = selectedState.includes(state);
      } else if (selectedState) {
        stateMatch = state === selectedState;
      }

      let locationMatch = true;
      const batchLocationId = getLocationId(batch);

      if (Array.isArray(selectedLocation)) {
        locationMatch =
          batchLocationId &&
          selectedLocation.includes(batchLocationId);
      } else if (selectedLocation) {
        locationMatch =
          batchLocationId === selectedLocation;
      }

      return stateMatch && locationMatch;
    });
  }, [safeBatches, selectedState, selectedLocation]);

  const statusTemplate = (rowData: Batch) => {
    const state = rowData.state || getBatchState(rowData);

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
      />
    );
  };

  const expirationTemplate = (rowData: Batch) => {
    const expiration = new Date(rowData.expirationDate);
    if (isNaN(expiration.getTime())) return <span>-</span>;

    const now = new Date();
    const hoursLeft =
      (expiration.getTime() - now.getTime()) /
      (1000 * 60 * 60);

    let color = "text-green-600";
    if (hoursLeft < 0)
      color = "text-red-600 font-semibold";
    else if (hoursLeft < 24)
      color = "text-orange-500 font-semibold";

    return (
      <span className={color}>
        {expiration.toLocaleString()}
      </span>
    );
  };

  const offerPriceTemplate = (rowData: Batch) => {
    if (!rowData.offerPrice) return <span>-</span>;
    return (
      <span className="text-blue-600 font-semibold">
        €{rowData.offerPrice}
      </span>
    );
  };

  const actionTemplate = (rowData: Batch) => {
    const state = rowData.state || getBatchState(rowData);

    if (state === "expired" || rowData.quantity === 0) {
      return <span className="text-gray-400">N/A</span>;
    }

    if (state === "in_offer") {
      return (
        <Button
          label="Deactivate"
          severity="secondary"
          size="small"
          onClick={() =>
            handleDeactivateOffer(rowData)
          }
        />
      );
    }

    return (
      <Button
        label="Activate Offer"
        icon="pi pi-bolt"
        size="small"
        onClick={() =>
          openOfferDialog(rowData)
        }
      />
    );
  };

  const openOfferDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setOfferPrice(batch.offerPrice ?? null);
    setOfferDialogVisible(true);
  };

  const handleActivateOffer = async () => {
    if (!selectedBatch || offerPrice === null) return;

    const id = getBatchId(selectedBatch);

    await activateOffer({
      id,
      offerPrice,
    }).unwrap();

    await refetch();
    setOfferDialogVisible(false);
  };

  const handleDeactivateOffer = async (
    batch: Batch
  ) => {
    const id = getBatchId(batch);
    await deactivateOffer(id).unwrap();
    await refetch();
  };

  const handleCreateBatch = async () => {
    if (
      !newBatch.title.trim() ||
      !newBatch.locationId ||
      !newBatch.expirationDate
    ) {
      alert("All fields are required");
      return;
    }

    const expiration = new Date(
      newBatch.expirationDate
    );

    if (expiration <= new Date()) {
      alert("Expiration must be in the future");
      return;
    }

    await createBatch({
      title: newBatch.title.trim(),
      quantity: Number(newBatch.quantity),
      basePrice: Number(newBatch.basePrice),
      expirationDate: expiration.toISOString(),
      locationId: newBatch.locationId,
    }).unwrap();

    await refetch();

    setCreateDialogVisible(false);
    setNewBatch({
      title: "",
      quantity: 0,
      basePrice: 0,
      expirationDate: "",
      locationId: "",
    });
  };

  if (!token)
    return <div className="p-6">Please login first.</div>;
  if (isLoading)
    return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">API Error</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Inventory Dashboard
        </h1>
        <Button
          label="Add Batch"
          icon="pi pi-plus"
          severity="success"
          onClick={() =>
            setCreateDialogVisible(true)
          }
        />
      </div>

      <div className="flex gap-4">
        <Dropdown
          value={selectedState}
          options={stateOptions}
          onChange={(e) =>
            setSelectedState(e.value)
          }
          className="w-56"
        />

        <Dropdown
          value={selectedLocation}
          options={locationOptions}
          onChange={(e) =>
            setSelectedLocation(e.value)
          }
          className="w-56"
        />

        <Button
          icon="pi pi-refresh"
          label="Refresh"
          onClick={refetch}
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
        <Column
          header="Offer Price"
          body={offerPriceTemplate}
        />
        <Column
          header="Expiration"
          body={expirationTemplate}
        />
        <Column
          header="Status"
          body={statusTemplate}
        />
        <Column
          header="Actions"
          body={actionTemplate}
        />
      </DataTable>

      <Dialog
        header="Activate Offer"
        visible={offerDialogVisible}
        style={{ width: "400px" }}
        onHide={() =>
          setOfferDialogVisible(false)
        }
      >
        <div className="flex flex-col gap-4">
          <InputNumber
            value={offerPrice}
            onValueChange={(e) =>
              setOfferPrice(e.value ?? null)
            }
            mode="currency"
            currency="EUR"
            locale="en-US"
            className="w-full"
          />
          <Button
            label="Confirm Offer"
            icon="pi pi-check"
            onClick={handleActivateOffer}
          />
        </div>
      </Dialog>

      <Dialog
        header="Create New Batch"
        visible={createDialogVisible}
        style={{ width: "450px" }}
        onHide={() =>
          setCreateDialogVisible(false)
        }
      >
        <div className="flex flex-col gap-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Batch Title"
            value={newBatch.title}
            onChange={(e) =>
              setNewBatch({
                ...newBatch,
                title: e.target.value,
              })
            }
          />

          <InputNumber
            value={newBatch.quantity}
            onValueChange={(e) =>
              setNewBatch({
                ...newBatch,
                quantity: e.value ?? 0,
              })
            }
            placeholder="Quantity"
          />

          <InputNumber
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
            placeholder="Base Price (€)"
          />

          <input
            type="datetime-local"
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