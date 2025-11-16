<%@ Language=VBScript %>
<%
' ASP Classic Include 테스트
%>
<!DOCTYPE html>
<html>
<head>
    <title>VS-Linker ASP Test</title>
</head>
<body>
    <!-- Header include -->
    <!--#include file="./header.asp"-->

    <div class="content">
        <h2>메인 컨텐츠</h2>
        <p>이것은 ASP Classic include 테스트 페이지입니다.</p>

        <%
        Response.Write("현재 시간: " & Now())
        %>
    </div>

    <!-- Footer include -->
    <!--#include file="./footer.asp"-->
</body>
</html>
