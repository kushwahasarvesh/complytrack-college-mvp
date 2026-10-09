package com.trovexis.complytrack.dashboard;

import com.trovexis.complytrack.deadline.DeadlineRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final DeadlineRepository deadlines;
    public DashboardController(DeadlineRepository deadlines) { this.deadlines=deadlines; }

    @GetMapping public Map<String, Long> summary(Authentication auth) {
        var all=deadlines.findAllByOwnerEmailOrderByDueDateAsc(auth.getName());
        long completed=all.stream().filter(d -> "COMPLETED".equals(d.getStatus())).count();
        long overdue=all.stream().filter(d -> "OVERDUE".equals(d.getStatus())).count();
        long dueSoon=all.stream().filter(d -> "DUE_SOON".equals(d.getStatus())).count();
        long upcoming=all.stream().filter(d -> "UPCOMING".equals(d.getStatus())).count();
        return Map.of("total", (long) all.size(), "upcoming", upcoming, "dueSoon", dueSoon, "overdue", overdue, "completed", completed);
    }
}
