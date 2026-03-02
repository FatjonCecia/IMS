import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";

import {
  useGetLocationsQuery,
  useCreateLocationMutation,
} from "../provider/queries/Location.query";

type Location = {
  _id: string;
  name: string;
  type: "restaurant" | "bakery" | "grocery";
  status: "active" | "paused";
};

const typeOptions = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Bakery", value: "bakery" },
  { label: "Grocery", value: "grocery" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
];

const About = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("user");

  const {
    data: locations = [],
    isLoading,
    isError,
    refetch,
  } = useGetLocationsQuery(undefined, {
    skip: !token,
  });

  const [createLocation, { isLoading: creating }] =
    useCreateLocationMutation();

  const [dialogVisible, setDialogVisible] = useState(false);

  const [newLocation, setNewLocation] = useState({
    name: "",
    type: "",
    status: "active",
  });

  const safeLocations = Array.isArray(locations) ? locations : [];

  const statusTemplate = (rowData: Location) => {
    return (
      <Tag
        value={rowData.status.toUpperCase()}
        severity={rowData.status === "active" ? "success" : "warning"}
      />
    );
  };

  const typeTemplate = (rowData: Location) => {
    return (
      <span className="capitalize font-medium">
        {rowData.type}
      </span>
    );
  };

  const handleCreateLocation = async () => {
    if (!newLocation.name.trim() || !newLocation.type) {
      alert("Name and type are required");
      return;
    }

    try {
      const payload = {
        name: newLocation.name.trim(),
        type: newLocation.type,
        status: newLocation.status,
      };

      console.log("Creating location:", payload);

      await createLocation(payload).unwrap();

      await refetch(); // refresh table instantly

      setNewLocation({
        name: "",
        type: "",
        status: "active",
      });

      setDialogVisible(false);
    } catch (error: any) {
      console.error("Create location failed:", error);
      alert(
        error?.data?.message || "Failed to create location"
      );
    }
  };

  if (!token) {
    return <div className="p-6">Please login first.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading locations...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load locations
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Locations Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage partner stores (restaurants, bakeries, groceries)
          </p>
        </div>

        <Button
          label="Add Location"
          icon="pi pi-plus"
          severity="success"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          value={safeLocations}
          paginator
          rows={10}
          responsiveLayout="scroll"
          emptyMessage="No locations available"
        >
          <Column field="name" header="Location Name" />
          <Column header="Type" body={typeTemplate} />
          <Column header="Status" body={statusTemplate} />
        </DataTable>
      </div>

      {/* Create Location Dialog */}
      <Dialog
        header="Add New Location"
        visible={dialogVisible}
        style={{ width: "450px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div className="flex flex-col gap-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Location Name"
            value={newLocation.name}
            onChange={(e) =>
              setNewLocation({
                ...newLocation,
                name: e.target.value,
              })
            }
          />

          <Dropdown
            value={newLocation.type}
            options={typeOptions}
            onChange={(e) =>
              setNewLocation({
                ...newLocation,
                type: e.value,
              })
            }
            placeholder="Select Location Type"
            className="w-full"
          />

          <Dropdown
            value={newLocation.status}
            options={statusOptions}
            onChange={(e) =>
              setNewLocation({
                ...newLocation,
                status: e.value,
              })
            }
            placeholder="Select Status"
            className="w-full"
          />

          <Button
            label="Create Location"
            icon="pi pi-check"
            loading={creating}
            onClick={handleCreateLocation}
            className="w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default About;