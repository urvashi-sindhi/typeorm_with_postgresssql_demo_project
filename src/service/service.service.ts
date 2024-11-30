import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { ServiceDto } from './dto/service.dto';
import { Service } from 'src/lib/entities/service.entity';
import { Messages } from 'src/lib/utils/messages';
import { handleResponse } from 'src/lib/helpers/handleResponse';
import { ResponseStatus, ServiceType } from 'src/lib/utils/enum';
import { ServiceImage } from 'src/lib/entities/serviceImages.entity';
import { SubService } from 'src/lib/entities/subService.entity';
import { ServiceDetails } from 'src/lib/entities/serviceDetails.entity';
import { paginate } from 'src/lib/helpers/paginationService';
import { pagination } from 'src/lib/helpers/commonPagination';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

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

  async listOfService(serviceInfo: any) {
    let whereCondition = {};

    if (serviceInfo.searchBar) {
      whereCondition = [{ service_name: Like(`%${serviceInfo.searchBar}%`) }];
    }

    const paginatedData = await paginate(serviceInfo, this.serviceRepository);

    const sortQuery = await pagination(
      serviceInfo.sortKey,
      serviceInfo.sortValue,
    );

    const listOfServiceName = await this.serviceRepository.find({
      where: whereCondition,
      order: sortQuery,
      take: paginatedData.pageSize,
      skip: paginatedData.skip,
      select: ['id', 'service_name'],
    });

    if (listOfServiceName.length <= 0) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Service ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`Service ${Messages.GET_SUCCESS}`);
    return handleResponse(HttpStatus.OK, ResponseStatus.SUCCESS, undefined, {
      listOfServiceName,
      totalPages: paginatedData?.totalPages,
      totalRecordsCount: paginatedData?.totalRecordsCount,
      currentPage: paginatedData?.currentPage,
      numberOfRows: listOfServiceName.length,
      limit: paginatedData?.limit,
    });
  }

  async getServiceList() {
    const listOfService = await this.serviceRepository.find({
      select: ['id', 'service_name'],
    });

    if (listOfService.length <= 0) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Service ${Messages.NOT_FOUND}`,
      );
    }

    const serviceDetails = listOfService.map((item) => {
      return {
        id: item.id,
        service_name: item.service_name,
        ServiceUrl: item.service_name + '-' + item.id,
      };
    });

    Logger.log(`Service name's ${Messages.GET_SUCCESS}`);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      serviceDetails,
    );
  }

  async viewService(serviceId: number) {
    const serviceData = await this.serviceRepository.findOne({
      where: { id: serviceId },
      select: {
        id: true,
        service_name: true,
        service_description: true,
        serviceImage: {
          id: true,
          overview_image: true,
          right_sidebar_image_1: true,
          service_image: true,
          right_sidebar_image_2: true,
          service_id: true,
        },
        subService: {
          id: true,
          sub_service_title: true,
          sub_service_description: true,
          service_id: true,
        },
      },
      relations: ['serviceImage', 'subService', 'serviceDetails'],
    });

    if (!serviceData) {
      Logger.error(`Service ${Messages.NOT_FOUND}`);
      return handleResponse(
        HttpStatus.NOT_FOUND,
        ResponseStatus.ERROR,
        `Service ${Messages.NOT_FOUND}`,
      );
    }

    let approachData = [];
    let benefitsData = [];
    let atcData = [];
    let consultingData = [];
    serviceData.serviceDetails.map((item) => {
      if (item.services_details_type === ServiceType.APPROACH) {
        approachData.push({
          id: item.id,
          services_details_point: item.services_details_point,
          service_id: item.service_id,
        });
      }
      if (item.services_details_type === ServiceType.BENEFITS) {
        benefitsData.push({
          id: item.id,
          services_details_point: item.services_details_point,
          service_id: item.service_id,
        });
      }
      if (item.services_details_type === ServiceType.ATC) {
        atcData.push({
          id: item.id,
          services_details_point: item.services_details_point,
          service_id: item.service_id,
        });
      }
      if (item.services_details_type === ServiceType.CONSULTING) {
        consultingData.push({
          id: item.id,
          services_details_point: item.services_details_point,
          services_details_description: item.services_details_description,
          service_id: item.service_id,
        });
      }
    });

    const responseData = {
      id: serviceData.id,
      service_name: serviceData.service_name,
      service_description: serviceData.service_description,
      serviceImages: serviceData.serviceImage,
      subService: serviceData.subService,
      Approach: approachData,
      Benefit: benefitsData,
      ATC: atcData,
      Consulting: consultingData,
    };

    Logger.log(`Service ${Messages.GET_SUCCESS}`);
    return handleResponse(
      HttpStatus.OK,
      ResponseStatus.SUCCESS,
      undefined,
      responseData,
    );
  }
}
