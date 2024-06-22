import { Facility } from './facility.model';
import { IFacility } from './facility.interface';

const createFacility = async (facilityData: IFacility) => {
  const facility = new Facility(facilityData);
  return await facility.save();
};

const updateFacility = async (id: string, updateData: Partial<IFacility>) => {
  return await Facility.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteFacility = async (id: string) => {
  return await Facility.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

const getAllFacilities = async () => {
  return await Facility.find({ isDeleted: false });
};

const getFacilityById = async (id: string) => {
  return await Facility.findById(id);
};

export const FacilityService = {
  createFacility,
  updateFacility,
  deleteFacility,
  getAllFacilities,
  getFacilityById,
};
