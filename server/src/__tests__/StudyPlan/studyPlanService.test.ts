import {describe, expect, test, jest} from '@jest/globals';
import { StudyPlanService } from '../../services/studyPlanService.js';
import { IStudyPlanRepository } from '../../repositories/IStudyPlanRepository.js';
import { CreateStudyPlanDTO } from '../../dtos/StudyPlanDTO.js';

describe("StudyPlan.generate", () => {
    test("must generate a plan for an authenticated user only", async () => {
        const create = jest
        .fn<(dto: CreateStudyPlanDTO, userId: number) => Promise<number>>()
        .mockResolvedValue(1);

        const repository = {
            create
        } as unknown as IStudyPlanRepository

        const service = new StudyPlanService(repository);
        const dto: CreateStudyPlanDTO = {
            title: "Test Plan",
            description: "This is just a test plan",
            is_saved: false,
            weeks: 			
[            {
				week_number: 1,
				title: "Getting Started with React",
				objectives: [
					"Understand React components and JSX",
					"Learn to use React hooks"
				],
				topics: [
					"React components and JSX",
					"React hooks"
				]
			}]
        }

        const studyPlan = await service.generate(dto, 1);

        expect(repository.create).toHaveBeenCalledWith(studyPlan);
    });

    test("must reject a plan generation without a user ID", async () => {
        const create = jest
        .fn<(dto: CreateStudyPlanDTO, userId: number) => Promise<number>>()
        .mockResolvedValue(0);

        const repository = {
            create
        } as unknown as IStudyPlanRepository

        const service = new StudyPlanService(repository);
        const dto: CreateStudyPlanDTO = {
            title: "Test Plan",
            description: "This is just a test plan",
            is_saved: false,
            weeks: 			
[            {
				week_number: 1,
				title: "Getting Started with React",
				objectives: [
					"Understand React components and JSX",
					"Learn to use React hooks"
				],
				topics: [
					"React components and JSX",
					"React hooks"
				]
			}]
        }

        await expect(service.generate(dto, 0)).rejects.toThrow("User not found");
    });

})

describe("StudyPlan.deletePlan", () => {
    test("must delete only the authenticated user's plan", async () => {
        const deletePlan = jest
        .fn<(planId: number, userId: number) => Promise<number>>()
        .mockResolvedValue(1);

        const repository = {
            deletePlan
        } as unknown as IStudyPlanRepository

        const service = new StudyPlanService(repository);

        await service.deletePlan(22, 36);

        expect(repository.deletePlan).toHaveBeenCalledWith(22, 36);
    });

    test("must not delete non-existing plans", async () => {
        const deletePlan = jest
        .fn<(planId: number, userId: number) => Promise<number>>()
        .mockResolvedValue(0);

        const repository = {
            deletePlan
        } as unknown as IStudyPlanRepository

        const service = new StudyPlanService(repository);

        await expect(service.deletePlan(999, 15)).rejects.toThrow(
            "Study plan not found"
        );

        expect(repository.deletePlan).toHaveBeenCalledWith(999, 15)
    })
});
