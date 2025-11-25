package com.codeandskills.billing_service.infrastructure.web.sales;

import com.codeandskills.billing_service.application.dto.PaymentDTO;
import com.codeandskills.billing_service.application.service.PaymentService;
import com.codeandskills.billing_service.infrastructure.dto.AdminSalesResponse;
import com.codeandskills.common.response.ApiResponse;
import com.codeandskills.common.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/billing/admin/sales")
@RequiredArgsConstructor
@Slf4j
public class AdminSaleController {
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PaymentDTO>>> getAllSales(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam (defaultValue = "", required = false) String userId,
            @RequestParam (defaultValue = "", required = false) String type,
            @RequestParam(defaultValue = "", required = false) String status
    ) {
        PagedResponse<PaymentDTO> pagedResponse =
                paymentService.getPayments(userId, status, type, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(200, "📦 Invoices  récupérés avec succès", pagedResponse)
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminSalesResponse>> getPaymentsStats() {
        AdminSalesResponse statsPayments = paymentService.getStatsPayments();

        return ResponseEntity.ok(
                ApiResponse.success(200, "📦 Invoices  récupérés avec succès", statsPayments)
        );
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getSaleById(
            @PathVariable String id
    ) {
        PaymentDTO response =
                paymentService.getPaymentById(id);

        return ResponseEntity.ok(
                ApiResponse.success(200, "📦 Invoices  récupérés avec succès", response)
        );
    }


    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentDTO>> refundPayment(
            @PathVariable String paymentId
    ) {
        PaymentDTO refunded = paymentService.refundPayment(paymentId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        200,
                        "💸 Paiement remboursé avec succès.",
                        refunded
                )
        );
    }
}
