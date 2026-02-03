package com.medical.portfolio.service;

import com.medical.portfolio.dto.NoticeRequest;
import com.medical.portfolio.dto.NoticeResponse;
import com.medical.portfolio.entity.Notice;
import com.medical.portfolio.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public Page<NoticeResponse> getNotices(int page, int size, String searchType, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Notice> noticePage;
        if (keyword == null || keyword.trim().isEmpty()) {
            noticePage = noticeRepository.findAll(pageable);
        } else {
            switch (searchType) {
                case "content":
                    noticePage = noticeRepository.findByContentContaining(keyword, pageable);
                    break;
                case "all":
                    noticePage = noticeRepository.searchByTitleOrContent(keyword, pageable);
                    break;
                default:
                    noticePage = noticeRepository.findByTitleContaining(keyword, pageable);
                    break;
            }
        }
        return noticePage.map(NoticeResponse::fromEntity);
    }

    @Transactional
    public NoticeResponse getNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 공지사항을 찾을 수 없습니다."));
        notice.setViewCount(notice.getViewCount() + 1);
        noticeRepository.save(notice);
        return NoticeResponse.fromEntity(notice);
    }

    @Transactional
    public NoticeResponse createNotice(NoticeRequest request, String authorName) {
        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(authorName)
                .viewCount(0)
                .build();
        return NoticeResponse.fromEntity(noticeRepository.save(notice));
    }

    @Transactional
    public NoticeResponse updateNotice(Long id, NoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 공지사항을 찾을 수 없습니다."));
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        return NoticeResponse.fromEntity(noticeRepository.save(notice));
    }

    @Transactional
    public void deleteNotice(Long id) {
        if (!noticeRepository.existsById(id)) {
            throw new RuntimeException("해당 공지사항을 찾을 수 없습니다.");
        }
        noticeRepository.deleteById(id);
    }
}
