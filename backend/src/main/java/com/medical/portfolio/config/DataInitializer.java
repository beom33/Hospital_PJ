package com.medical.portfolio.config;

import com.medical.portfolio.entity.Hospital;
import com.medical.portfolio.entity.MedicalFee;
import com.medical.portfolio.entity.Notice;
import com.medical.portfolio.repository.HospitalRepository;
import com.medical.portfolio.repository.MedicalFeeRepository;
import com.medical.portfolio.repository.NoticeRepository;
import com.medical.portfolio.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final HospitalRepository hospitalRepository;
    private final MedicalFeeRepository medicalFeeRepository;
    private final NoticeRepository noticeRepository;

    @Override
    public void run(String... args) throws Exception {
        // 테스트용 사용자 생성
        authService.registerTestUser();
        System.out.println("=".repeat(50));
        System.out.println("테스트 계정이 생성되었습니다:");
        System.out.println("아이디: admin");
        System.out.println("비밀번호: admin123");
        System.out.println("=".repeat(50));

        // 샘플 병원 및 비급여 진료비 데이터 생성
        if (hospitalRepository.count() == 0) {
            initializeMedicalFeeData();
            System.out.println("병원 및 비급여 진료비 샘플 데이터가 생성되었습니다.");
        }

        // 샘플 공지사항 데이터 생성
        if (noticeRepository.count() == 0) {
            initializeNoticeData();
            System.out.println("공지사항 샘플 데이터가 생성되었습니다.");
        }
    }

    private void initializeNoticeData() {
        noticeRepository.save(Notice.builder()
                .title("2026년 설 연휴 진료 안내")
                .content("안녕하세요. Medi-Best 병원입니다.\n\n2026년 설 연휴 진료 안내드립니다.\n\n- 1월 27일(화) ~ 1월 29일(목): 휴진\n- 1월 30일(금): 정상 진료\n\n응급 환자는 응급실을 이용해 주시기 바랍니다.\n감사합니다.")
                .author("관리자")
                .viewCount(156)
                .build());

        noticeRepository.save(Notice.builder()
                .title("비급여 진료비 조회 시스템 오픈 안내")
                .content("안녕하세요.\n\n비급여 진료비 조회 시스템이 정식 오픈되었습니다.\n\n병원별 비급여 항목의 가격을 비교하실 수 있으며, 건강보험심사평가원 공공데이터를 기반으로 정확한 정보를 제공합니다.\n\n많은 이용 부탁드립니다.")
                .author("관리자")
                .viewCount(243)
                .build());

        noticeRepository.save(Notice.builder()
                .title("개인정보 처리방침 변경 안내")
                .content("개인정보 처리방침이 2026년 2월 1일부로 변경됩니다.\n\n주요 변경 사항:\n1. 개인정보 보유 기간 변경\n2. 제3자 제공 항목 추가\n3. 개인정보 보호 책임자 변경\n\n자세한 내용은 개인정보 처리방침 페이지를 참조해 주세요.")
                .author("관리자")
                .viewCount(89)
                .build());

        noticeRepository.save(Notice.builder()
                .title("시스템 점검 안내 (2월 5일)")
                .content("시스템 안정화를 위한 정기 점검이 진행됩니다.\n\n- 점검일시: 2026년 2월 5일(목) 02:00 ~ 06:00\n- 점검내용: 서버 업그레이드 및 보안 패치\n\n점검 시간 동안 서비스 이용이 제한될 수 있습니다.\n이용에 불편을 드려 죄송합니다.")
                .author("관리자")
                .viewCount(67)
                .build());

        noticeRepository.save(Notice.builder()
                .title("회원가입 이벤트 안내")
                .content("신규 회원가입 이벤트를 진행합니다.\n\n- 기간: 2026년 2월 1일 ~ 2월 28일\n- 대상: 신규 가입 회원\n- 혜택: 비급여 진료비 비교 리포트 무료 제공\n\n많은 참여 부탁드립니다.")
                .author("관리자")
                .viewCount(198)
                .build());
    }

    private void initializeMedicalFeeData() {
        // 병원 데이터 생성
        Hospital hospital1 = hospitalRepository.save(Hospital.builder()
                .name("서울대학교병원")
                .type("상급종합")
                .address("서울특별시 종로구 대학로 101")
                .region("서울")
                .phone("02-2072-2114")
                .build());

        Hospital hospital2 = hospitalRepository.save(Hospital.builder()
                .name("삼성서울병원")
                .type("상급종합")
                .address("서울특별시 강남구 일원로 81")
                .region("서울")
                .phone("02-3410-2114")
                .build());

        Hospital hospital3 = hospitalRepository.save(Hospital.builder()
                .name("세브란스병원")
                .type("상급종합")
                .address("서울특별시 서대문구 연세로 50-1")
                .region("서울")
                .phone("02-2228-5800")
                .build());

        Hospital hospital4 = hospitalRepository.save(Hospital.builder()
                .name("우리병원")
                .type("병원")
                .address("경기도 수원시 팔달구 인계로 123")
                .region("경기")
                .phone("031-123-4567")
                .build());

        Hospital hospital5 = hospitalRepository.save(Hospital.builder()
                .name("강남성모병원")
                .type("상급종합")
                .address("서울특별시 서초구 반포대로 222")
                .region("서울")
                .phone("02-590-1114")
                .build());

        Hospital hospital6 = hospitalRepository.save(Hospital.builder()
                .name("건국대학교병원")
                .type("상급종합")
                .address("서울특별시 광진구 능동로 120-1")
                .region("서울")
                .phone("02-2030-5114")
                .build());

        Hospital hospital7 = hospitalRepository.save(Hospital.builder()
                .name("아산병원")
                .type("상급종합")
                .address("서울특별시 송파구 올림픽로 43길 88")
                .region("서울")
                .phone("02-3010-3114")
                .build());

        // 비급여 진료비 데이터 생성
        // 서울대병원
        createMedicalFee(hospital1, "MRI", null, "뇌 MRI", 450000, 650000, "조영제 별도", false);
        createMedicalFee(hospital1, "MRI", null, "척추 MRI", 400000, 600000, "1부위 기준", false);
        createMedicalFee(hospital1, "이학요법료", null, "도수치료", 80000, 150000, "1회 20분 기준", false);
        createMedicalFee(hospital1, "예방접종료", null, "대상포진", 150000, 180000, "1회 접종", false);
        createMedicalFee(hospital1, "예방접종료", null, "인플루엔자(독감)", 35000, 45000, "4가 백신", false);

        // 삼성서울병원
        createMedicalFee(hospital2, "MRI", null, "뇌 MRI", 500000, 700000, "조영제 별도", false);
        createMedicalFee(hospital2, "MRI", null, "척추 MRI", 450000, 650000, "1부위 기준", false);
        createMedicalFee(hospital2, "이학요법료", null, "도수치료", 100000, 180000, "1회 30분 기준", false);
        createMedicalFee(hospital2, "예방접종료", null, "대상포진", 160000, 190000, "1회 접종", false);
        createMedicalFee(hospital2, "초음파", null, "복부 초음파", 80000, 120000, "상복부 기준", false);

        // 세브란스병원
        createMedicalFee(hospital3, "MRI", null, "뇌 MRI", 480000, 680000, "조영제 별도", false);
        createMedicalFee(hospital3, "이학요법료", null, "도수치료", 90000, 160000, "1회 25분 기준", false);
        createMedicalFee(hospital3, "예방접종료", null, "대상포진", 155000, 175000, "1회 접종", false);
        createMedicalFee(hospital3, "예방접종료", null, "폐렴구균", 120000, 150000, "1회 접종", false);
        createMedicalFee(hospital3, "치과", null, "임플란트", 1200000, 1800000, "1개 기준", false);

        // 우리병원
        createMedicalFee(hospital4, "이학요법료", null, "도수치료", 70000, 120000, "1회 20분 기준", false);
        createMedicalFee(hospital4, "이학요법료", null, "증식치료", 50000, 100000, "1부위 기준", false);
        createMedicalFee(hospital4, "이학요법료", null, "체외충격파", 50000, 80000, "1부위 기준", false);
        createMedicalFee(hospital4, "예방접종료", null, "대상포진", 140000, 160000, "1회 접종", false);
        createMedicalFee(hospital4, "예방접종료", null, "인플루엔자(독감)", 30000, 40000, "4가 백신", false);
        createMedicalFee(hospital4, "기능검사료", null, "체온열검사", 100000, 150000, null, false);

        // 강남성모병원
        createMedicalFee(hospital5, "MRI", null, "뇌 MRI", 470000, 670000, "조영제 별도", false);
        createMedicalFee(hospital5, "이학요법료", null, "도수치료", 85000, 140000, "1회 20분 기준", false);
        createMedicalFee(hospital5, "예방접종료", null, "대상포진", 145000, 170000, "1회 접종", false);
        createMedicalFee(hospital5, "치과", null, "치아미백", 200000, 400000, "전체 기준", false);

        // 건국대학교병원
        createMedicalFee(hospital6, "MRI", null, "뇌 MRI", 420000, 620000, "조영제 별도", false);
        createMedicalFee(hospital6, "이학요법료", null, "도수치료", 75000, 130000, "1회 20분 기준", false);
        createMedicalFee(hospital6, "예방접종료", null, "인플루엔자(독감)", 32000, 42000, "4가 백신", false);

        // 아산병원
        createMedicalFee(hospital7, "MRI", null, "뇌 MRI", 520000, 720000, "조영제 별도", false);
        createMedicalFee(hospital7, "MRI", null, "척추 MRI", 480000, 680000, "1부위 기준", false);
        createMedicalFee(hospital7, "이학요법료", null, "도수치료", 110000, 200000, "1회 30분 기준", false);
        createMedicalFee(hospital7, "예방접종료", null, "대상포진", 165000, 195000, "1회 접종", false);
        createMedicalFee(hospital7, "치과", null, "임플란트", 1300000, 2000000, "1개 기준", false);

        // === 시력 교정술료 데이터 추가 ===
        // 안과 전문 병원 추가
        Hospital eyeHospital1 = hospitalRepository.save(Hospital.builder()
                .name("밝은눈안과")
                .type("의원")
                .address("서울특별시 강남구 테헤란로 123")
                .region("서울")
                .phone("02-555-1234")
                .build());

        Hospital eyeHospital2 = hospitalRepository.save(Hospital.builder()
                .name("서울밝은세상안과")
                .type("의원")
                .address("서울특별시 서초구 강남대로 456")
                .region("서울")
                .phone("02-123-5678")
                .build());

        Hospital eyeHospital3 = hospitalRepository.save(Hospital.builder()
                .name("비앤빛강남밝은세상안과")
                .type("의원")
                .address("서울특별시 강남구 논현로 789")
                .region("서울")
                .phone("02-987-6543")
                .build());

        // 라식수술
        createMedicalFee(eyeHospital1, "시력교정술료", null, "라식수술", 1000000, 1500000, "양안 기준", false);
        createMedicalFee(eyeHospital2, "시력교정술료", null, "라식수술", 1200000, 1800000, "양안 기준", false);
        createMedicalFee(eyeHospital3, "시력교정술료", null, "라식수술", 1500000, 2000000, "양안 기준", false);

        // 라섹수술
        createMedicalFee(eyeHospital1, "시력교정술료", null, "라섹수술", 1200000, 1700000, "양안 기준", false);
        createMedicalFee(eyeHospital2, "시력교정술료", null, "라섹수술", 1400000, 2000000, "양안 기준", false);
        createMedicalFee(eyeHospital3, "시력교정술료", null, "라섹수술", 1600000, 2200000, "양안 기준", false);

        // 스마일라식
        createMedicalFee(eyeHospital1, "시력교정술료", null, "스마일라식", 2000000, 2500000, "양안 기준", false);
        createMedicalFee(eyeHospital2, "시력교정술료", null, "스마일라식", 2200000, 2800000, "양안 기준", false);
        createMedicalFee(eyeHospital3, "시력교정술료", null, "스마일라식", 2500000, 3000000, "양안 기준", false);

        // 렌즈삽입술
        createMedicalFee(eyeHospital1, "시력교정술료", null, "렌즈삽입술", 3000000, 4000000, "양안 기준, ICL", false);
        createMedicalFee(eyeHospital2, "시력교정술료", null, "렌즈삽입술", 3500000, 4500000, "양안 기준, ICL", false);
        createMedicalFee(eyeHospital3, "시력교정술료", null, "렌즈삽입술", 4000000, 5000000, "양안 기준, ICL", false);

        // === 물리치료 - 근막이완술 추가 ===
        createMedicalFee(hospital1, "이학요법료", null, "근막이완술", 50000, 80000, "1부위 기준", false);
        createMedicalFee(hospital2, "이학요법료", null, "근막이완술", 60000, 90000, "1부위 기준", false);
        createMedicalFee(hospital4, "이학요법료", null, "근막이완술", 40000, 70000, "1부위 기준", false);

        // === 치과 데이터 추가 ===
        Hospital dentalHospital1 = hospitalRepository.save(Hospital.builder()
                .name("서울미소치과")
                .type("의원")
                .address("서울특별시 강남구 도산대로 100")
                .region("서울")
                .phone("02-333-4444")
                .build());

        Hospital dentalHospital2 = hospitalRepository.save(Hospital.builder()
                .name("강남유디치과")
                .type("의원")
                .address("서울특별시 서초구 서초대로 200")
                .region("서울")
                .phone("02-555-6666")
                .build());

        // 치아교정
        createMedicalFee(dentalHospital1, "치과", null, "치아교정", 3000000, 5000000, "전체 교정 기준", false);
        createMedicalFee(dentalHospital2, "치과", null, "치아교정", 3500000, 6000000, "전체 교정 기준", false);
        createMedicalFee(hospital3, "치과", null, "치아교정", 4000000, 7000000, "전체 교정 기준", false);

        // 라미네이트
        createMedicalFee(dentalHospital1, "치과", null, "라미네이트", 400000, 800000, "1개 기준", false);
        createMedicalFee(dentalHospital2, "치과", null, "라미네이트", 500000, 900000, "1개 기준", false);

        // 틀니
        createMedicalFee(dentalHospital1, "치과", null, "틀니", 500000, 1500000, "전체틀니 기준", false);
        createMedicalFee(dentalHospital2, "치과", null, "틀니", 600000, 1800000, "전체틀니 기준", false);

        // 임플란트 추가
        createMedicalFee(dentalHospital1, "치과", null, "임플란트", 1000000, 1500000, "1개 기준", false);
        createMedicalFee(dentalHospital2, "치과", null, "임플란트", 1100000, 1600000, "1개 기준", false);

        // 치아미백
        createMedicalFee(dentalHospital1, "치과", null, "치아미백", 150000, 350000, "전체 기준", false);
        createMedicalFee(dentalHospital2, "치과", null, "치아미백", 200000, 400000, "전체 기준", false);
    }

    private void createMedicalFee(Hospital hospital, String category, String subCategory,
                                   String itemName, int minPrice, int maxPrice,
                                   String note, boolean isCovered) {
        medicalFeeRepository.save(MedicalFee.builder()
                .hospital(hospital)
                .category(category)
                .subCategory(subCategory)
                .itemName(itemName)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .note(note)
                .isCovered(isCovered)
                .build());
    }
}
