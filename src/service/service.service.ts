import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ServiceDto } from './dto/service.dto';
import { Service } from 'src/lib/entities/service.entity';
import { Messages } from 'src/lib/utils/messages';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ResponseStatus, ServiceType } from 'src/lib/utils/enum';
import { ServiceImage } from 'src/lib/entities/serviceImages.entity';
import { SubService } from 'src/lib/entities/subService.entity';
import { ServiceDetails } from 'src/lib/entities/serviceDetails.entity';

@Injectable()
export class ServiceService {
  constructor(private dataSource: DataSource) {}

  async addService(dto: ServiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const {
        service_name,
        serviceImageDetail,
        service_description,
        subService,
        serviceDetailsATC,
        serviceDetailsApproach,
        serviceDetailsBenefits,
        serviceDetailsConsulting,
      } = dto;

      const findService = await queryRunner.manager.findOne(Service, {
        where: { service_name },
      });

      if (findService) {
        Logger.error(`Service ${Messages.ALREADY_EXIST}`);
        return handleResponse(
          HttpStatus.CONFLICT,
          ResponseStatus.ERROR,
          `Service ${Messages.ALREADY_EXIST}`,
        );
      }

      const createService = await queryRunner.manager.save(Service, {
        service_name,
        service_description,
      });

      const serviceId = createService.id;

      if (createService) {
        if (serviceImageDetail) {
          const createServiceImage = serviceImageDetail.map((images) => {
            return {
              overview_image: images.overview_image,
              service_image: images.service_image,
              right_sidebar_image_1: images.right_sidebar_image_1,
              right_sidebar_image_2: images.right_sidebar_image_2,
              service_id: serviceId,
            };
          });

          await queryRunner.manager.insert(ServiceImage, createServiceImage);
        }

        if (subService) {
          const createSubService = subService.map((service) => {
            return {
              sub_service_title: service.sub_service_title,
              sub_service_description: service.sub_service_description,
              service_id: serviceId,
            };
          });

          await queryRunner.manager.insert(SubService, createSubService);
        }

        if (serviceDetailsApproach) {
          const createServiceDetails = serviceDetailsApproach.map((details) => {
            return {
              services_details_type: ServiceType.APPROACH,
              services_details_point: details.services_details_point,
              service_id: serviceId,
            };
          });

          await queryRunner.manager.insert(
            ServiceDetails,
            createServiceDetails,
          );
        }

        if (serviceDetailsBenefits) {
          const createServiceDetails = serviceDetailsBenefits.map((details) => {
            return {
              services_details_type: ServiceType.BENEFITS,
              services_details_point: details.services_details_point,
              service_id: serviceId,
            };
          });

          await queryRunner.manager.insert(
            ServiceDetails,
            createServiceDetails,
          );
        }

        if (serviceDetailsATC) {
          const createServiceDetails = serviceDetailsATC.map((details) => {
            return {
              services_details_type: ServiceType.ATC,
              services_details_point: details.services_details_point,
              service_id: serviceId,
            };
          });

          await queryRunner.manager.insert(
            ServiceDetails,
            createServiceDetails,
          );
        }

        if (serviceDetailsConsulting) {
          const createServiceDetails = serviceDetailsConsulting.map(
            (details) => {
              return {
                services_details_type: ServiceType.CONSULTING,
                services_details_point: details.services_details_point,
                services_details_description:
                  details.services_details_description,
                service_id: serviceId,
              };
            },
          );

          await queryRunner.manager.insert(
            ServiceDetails,
            createServiceDetails,
          );
        }

        await queryRunner.commitTransaction();

        Logger.log(`Service ${Messages.ADDED_SUCCESS}`);
        return handleResponse(
          HttpStatus.CREATED,
          ResponseStatus.SUCCESS,
          `Service ${Messages.ADDED_SUCCESS}`,
          { id: serviceId },
        );
      }
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      Logger.error(Messages.SERVER_ERROR);
      return handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseStatus.ERROR,
        Messages.SERVER_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async editService(serviceId: number, dto: ServiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const {
        service_name,
        serviceImageDetail,
        service_description,
        subService,
        serviceDetailsATC,
        serviceDetailsApproach,
        serviceDetailsBenefits,
        serviceDetailsConsulting,
      } = dto;

      const findService = await queryRunner.manager.findOne(Service, {
        where: { id: serviceId },
      });

      if (!findService) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return handleResponse(
          HttpStatus.NOT_FOUND,
          ResponseStatus.ERROR,
          `Service ${Messages.NOT_FOUND}`,
        );
      }

      await queryRunner.manager.update(
        Service,
        { id: serviceId },
        {
          service_name,
          service_description,
        },
      );

      if (serviceImageDetail) {
        await queryRunner.manager.delete(ServiceImage, {
          service_id: serviceId,
        });

        const createServiceImage = serviceImageDetail.map((images) => {
          return {
            overview_image: images.overview_image,
            service_image: images.service_image,
            right_sidebar_image_1: images.right_sidebar_image_1,
            right_sidebar_image_2: images.right_sidebar_image_2,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(ServiceImage, createServiceImage);
      }

      if (subService) {
        await queryRunner.manager.delete(SubService, {
          service_id: serviceId,
        });

        const createSubService = subService.map((service) => {
          return {
            sub_service_title: service.sub_service_title,
            sub_service_description: service.sub_service_description,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(SubService, createSubService);
      }

      if (serviceDetailsApproach) {
        await queryRunner.manager.delete(ServiceDetails, {
          service_id: serviceId,
        });

        const createServiceDetails = serviceDetailsApproach.map((details) => {
          return {
            services_details_type: ServiceType.APPROACH,
            services_details_point: details.services_details_point,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(ServiceDetails, createServiceDetails);
      }

      if (serviceDetailsBenefits) {
        const createServiceDetails = serviceDetailsBenefits.map((details) => {
          return {
            services_details_type: ServiceType.BENEFITS,
            services_details_point: details.services_details_point,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(ServiceDetails, createServiceDetails);
      }

      if (serviceDetailsATC) {
        const createServiceDetails = serviceDetailsATC.map((details) => {
          return {
            services_details_type: ServiceType.ATC,
            services_details_point: details.services_details_point,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(ServiceDetails, createServiceDetails);
      }

      if (serviceDetailsConsulting) {
        const createServiceDetails = serviceDetailsConsulting.map((details) => {
          return {
            services_details_type: ServiceType.CONSULTING,
            services_details_point: details.services_details_point,
            services_details_description: details.services_details_description,
            service_id: serviceId,
          };
        });

        await queryRunner.manager.insert(ServiceDetails, createServiceDetails);
      }

      await queryRunner.commitTransaction();

      Logger.log(`Service ${Messages.UPDATE_SUCCESS}`);
      return handleResponse(
        HttpStatus.ACCEPTED,
        ResponseStatus.SUCCESS,
        `Service ${Messages.UPDATE_SUCCESS}`,
      );
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      Logger.error(Messages.SERVER_ERROR);
      return handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseStatus.ERROR,
        Messages.SERVER_ERROR,
        undefined,
        error.message,
      );
    }
  }

  async deleteService(serviceId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const findService = await queryRunner.manager.findOne(Service, {
        where: { id: serviceId },
      });

      if (!findService) {
        Logger.error(`Service ${Messages.NOT_FOUND}`);
        return handleResponse(
          HttpStatus.NOT_FOUND,
          ResponseStatus.ERROR,
          `Service ${Messages.NOT_FOUND}`,
        );
      }

      await queryRunner.manager.delete(ServiceImage, { service_id: serviceId });

      await queryRunner.manager.delete(SubService, {
        service_id: serviceId,
      });

      await queryRunner.manager.delete(ServiceDetails, {
        service_id: serviceId,
      });

      await queryRunner.manager.delete(Service, {
        id: serviceId,
      });

      await queryRunner.commitTransaction();

      Logger.log(`Service ${Messages.DELETE_SUCCESS}`);
      return handleResponse(
        HttpStatus.OK,
        ResponseStatus.SUCCESS,
        `Service ${Messages.DELETE_SUCCESS}`,
      );
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      Logger.error(Messages.SERVER_ERROR);
      return handleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ResponseStatus.ERROR,
        Messages.SERVER_ERROR,
        undefined,
        error.message,
      );
    }
  }
}
