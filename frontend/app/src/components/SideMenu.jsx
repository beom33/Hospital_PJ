import { Link, useLocation } from "react-router-dom";

export default function SideMenu() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "병원소개",
      path: "/about",
      subItems: [
        { title: "인사말", path: "/about/greeting" },
        { title: "의료진 소개", path: "/about/doctors" },
        { title: "시설 안내", path: "/about/facilities" },
        { title: "오시는 길", path: "/about/location" },
      ],
    },
    {
      title: "공지사항",
      path: "/notice",
      subItems: [
        { title: "공지사항", path: "/notice" },
        { title: "병원소식", path: "/notice/news" },
      ],
    },
    {
      title: "진료안내",
      path: "/insurance",
      subItems: [
        { title: "보험적용확인", path: "/insurance" },
        { title: "진료과목안내", path: "/departments" },
        { title: "진료시간안내", path: "/hours" },
      ],
    },
  ];

  const isActive = (path) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <aside className="side-menu">
      {menuItems.map((menu, index) => (
        <div key={index} className="side-menu-section">
          <div className={`side-menu-title ${isActive(menu.path) ? "active" : ""}`}>
            {menu.title}
          </div>
          <ul className="side-menu-list">
            {menu.subItems.map((item, subIndex) => (
              <li key={subIndex} className={`side-menu-item ${currentPath === item.path ? "active" : ""}`}>
                <Link to={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
