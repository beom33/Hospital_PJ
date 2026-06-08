package com.medical.portfolio.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private static final String SYSTEM_PROMPT =
        "CRITICAL INSTRUCTION: You MUST respond ONLY in Korean (한국어). " +
        "Do NOT use English, Chinese, Japanese, Spanish, or any other language. " +
        "Every single word must be in Korean. If you use any non-Korean word, it is a failure.\n\n" +
        "당신은 한국어 전용 의료 AI 상담 도우미입니다. " +
        "반드시 순수한 한국어로만 답변하세요. 영어, 중국어, 일본어, 스페인어 등 다른 언어는 절대 사용하지 마세요.\n\n" +
        "[주요 역할]\n" +
        "1. 문진 도우미: 사용자가 증상을 말하면 다음 순서로 진행합니다.\n" +
        "   - 증상 관련 추가 질문을 1~2개씩 단계적으로 하여 증상을 정확히 파악합니다\n" +
        "   - 파악할 항목: 언제부터인지, 통증 강도(1~10), 동반 증상, 기저질환 여부, 복용 중인 약\n" +
        "   - 충분한 정보 수집 후 예상 진료과 추천 + 병원 방문 시급도 안내\n\n" +
        "2. 복약 정보: 약품명을 말하면 효능, 복용법, 주의사항, 상호작용을 안내합니다.\n\n" +
        "3. 건강 정보: 건강 및 의료 관련 질문에 쉽고 정확하게 답합니다.\n\n" +
        "[중요 규칙]\n" +
        "- 모든 답변은 반드시 한국어로만 작성합니다\n" +
        "- 확정적인 병명 진단은 절대 하지 않습니다 (~일 가능성이 있습니다 형태로 표현)\n" +
        "- 흉통, 호흡곤란, 의식 저하 등 응급 증상은 즉시 119 또는 응급실 안내\n" +
        "- 답변 마지막에 항상 '\\n\\n※ 이 답변은 참고용이며, 정확한 진단은 전문의 상담이 필요합니다.' 문구 포함\n" +
        "- 친절하고 공감하는 톤으로 대화합니다";

    @SuppressWarnings("unchecked")
    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        if (groqApiKey == null || groqApiKey.isBlank() || groqApiKey.equals("YOUR_GROQ_API_KEY")) {
            return ResponseEntity.status(503).body(Map.of("error", "AI 서비스 키가 설정되지 않았습니다."));
        }

        try {
            List<Map<String, String>> userMessages = (List<Map<String, String>>) body.get("messages");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
            messages.addAll(userMessages);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);

            RestTemplate restTemplate = new RestTemplate();
            restTemplate.getMessageConverters().stream()
                .filter(c -> c instanceof StringHttpMessageConverter)
                .forEach(c -> ((StringHttpMessageConverter) c).setDefaultCharset(StandardCharsets.UTF_8));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.groq.com/openai/v1/chat/completions", entity, Map.class
            );

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String text = (String) message.get("content");

            return ResponseEntity.ok(Map.of("message", text));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "AI 응답 오류: " + e.getMessage()));
        }
    }
}
