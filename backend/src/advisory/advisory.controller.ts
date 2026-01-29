import { Controller, Get } from "@nestjs/common";

@Controller("advisory")
export class AdvisoryController {

    @Get()
    getAdvice() {
        return [
            "Inspect hives during seasonal transitions",
            "Avoid harvesting during high stress periods",
            "Relocate hives from drought-prone zones"
        ];
    }
}
